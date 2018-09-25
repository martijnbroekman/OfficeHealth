const axios = require("axios");
const querystring = require("querystring");
const jwt_decode = require('jwt-decode');
const signalR = require("@aspnet/signalr");
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.WebSocket = require('websocket').w3cwebsocket;


let accessToken = null;
let id = null;
const apiUrl = "http://localhost:5000";

let callBack = null
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

module.exports = {
    login: login,
    changeNotificationStatus: changeNotificationStatus,
    onNotification: ((newCallBack) => callBack = newCallBack)
}