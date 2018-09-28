const axios = require("axios");
const querystring = require("querystring");
const jwt_decode = require('jwt-decode');
const signalR = require("@aspnet/signalr");
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.WebSocket = require('websocket').w3cwebsocket;


let accessToken = null;
let id = null;
const apiUrl = "http://167.99.38.7";

let callBack = null;
let acceptCallBack = null;
let declineCallBack = null;
let connection =  null;

const startListening = () => {
    
    connection = new signalR.HubConnectionBuilder()
    .withUrl(`${apiUrl}/hubs/notifications?token=${accessToken}`)
    .build();

    connection.on("notification", data => {
        if (callBack !== null) {
            callBack(data);
        }
    });

    connection.on("notification:accept", data => {
        if (acceptCallBack !== null) {
            acceptCallBack(data);
        }
    });

    connection.on("notification:decline", data => {
        if (declineCallBack !== null) {
            declineCallBack(data);
        }
    });

    connection.start()
    .then(() => console.log('started listening')).catch(error => console.log(error));
}

    
const getDefaultConfig = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    }
}

const register = (mail, name, password, type) => {
    return new Promise((resolve, reject) => {
        let content = {
            mail: mail,
            name: name,
            password: password,
            type: type
        }
    
        axios.post(apiUrl + '/users', content)
        .then(res => {
            resolve(res);
        })
        .catch(error => {
            reject(error);
        });
    })
}

const login = (username, password) => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    let content = querystring.stringify({
        username: username,
        password: password,
        grant_type: "password"
    });

    return new Promise((resolve, reject) => {
        axios.post(apiUrl + '/connect/token', content, config)
        .then(res => {
            accessToken = res.data.access_token;
            let decodedToken = jwt_decode(accessToken);
            id = decodedToken.sub;
            startListening();
            resolve(decodedToken);
        })
        .catch(error => reject(error));
    });
}

const changeNotificationStatus = (canReceiveNotification) => {
    axios.patch(`${apiUrl}/users/${id}`, { canReceiveNotification: canReceiveNotification }, getDefaultConfig())
        .then(() => console.log("CanRecieveNotifications was saved"))
        .catch(() => console.log("failed to save canRecieveNotifications"));
}

const responseOnNotification = (notificationId, accepted) => {
    axios.patch(`${apiUrl}/notifications/${notificationId}/accept`, { accept: accepted }, getDefaultConfig())
        .then(() => console.log("accepted was saved"))
        .catch(() => console.log("failed to save accepted"));
}

const sendEmotion = (emotions) => {
    return new Promise((resolve, reject) => {
        emotions.userId = id;
        axios.post(apiUrl + '/emotions', emotions)
            .then((res) => {
                resolve(res)
            })
            .catch((error) => {
                reject(error)
            });
    });
}

module.exports = {
    login: login,
    register: register,
    changeNotificationStatus: changeNotificationStatus,
    responseOnNotification: responseOnNotification,
    sendEmotion: sendEmotion,
    onNotification: ((newCallBack) => callBack = newCallBack),
    onAccept: ((newacceptCallBack) => acceptCallBack = newacceptCallBack),
    onDecline: ((newdeclineCallBack) => declineCallBack = newdeclineCallBack)
}