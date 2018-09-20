const electron = require('electron');
const url = require('url');
const qs = require('qs');
const jwt_decode = require('jwt-decode');
const axios = require('axios');
const moment = require('moment');

const { app, BrowserWindow, Menu, ipcMain, remote } = electron;
const { parse } = url;

let creditials = null;

module.exports = {
    fitbitSignIn: function signInWithPopup () {
        return new Promise((resolve, reject) => {
            
            const current_time = Date.now() / 1000;
            if ( creditials != null && !(jwt_decode(creditials.access_token).exp < current_time)) {
                resolve(creditials);
            } else {
                const authWindow = new BrowserWindow({
                width: 500,
                height: 600,
                show: true,
                });
        
                const urlParams = {
                    client_id: '22D722',
                    response_type: 'token',
                    scope: 'heartrate activity',
                    redirect_url: 'https://redshedgathering.com/callback',
                    expires_in: '2592000' //30 days
                }
        
                const fitbit_url = 'https://www.fitbit.com/oauth2/authorize?';
                const authUrl = fitbit_url + qs.stringify(urlParams);
        
                function handleNavigation (url) {
                    const hash = parse(url, true).hash;
                    if (hash) {
                        const formattedHash = formatHashFromUrl(hash);
                        if (formattedHash.access_token) {
                            authWindow.removeAllListeners('closed');
                            setImmediate(() => { 
                                authWindow.close();
                            });
                            
                            creditials = formattedHash;
                            resolve(formattedHash);
                        }
                    }
                }
        
                authWindow.on('closed', () => {
                    reject('closed');
                })
        
                authWindow.webContents.on('will-navigate', (event, url) => {
                    handleNavigation(url)
                })
        
                authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
                    handleNavigation(newUrl)
                })
        
                authWindow.loadURL(authUrl)
            }
        });
    },
    getHeartBeat: function getHeartBeat(date, startTime, endTime) {
        return new Promise((resolve, reject) => {
            if (!moment(date, 'yyyy-MM-dd').isValid()) {
                reject("date isn't a valid date use the yyyy-MM-dd format");
            } else if (!moment(startTime, 'HH:mm').isValid()) {
                reject ("startTime isn't a valid time use the HH:mm format")
            } else if (!moment(endTime, 'HH:mm').isValid()) {
                reject ("endTime isn't a valid time use the HH:mm format")
            } else {
                let heartbeatUrl = `https://api.fitbit.com/1/user/-/activities/heart/date/${date}/1d/1min/time/${startTime}/${endTime}.json`;
                
                axios.get(heartbeatUrl, {
                    headers: {
                        Authorization: 'Bearer ' + creditials.access_token 
                    },
                }).then((response) => {
                    resolve(response.data['activities-heart-intraday'].dataset);
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    },
    getSteps: function getSteps(date, startTime, endTime) {
        return new Promise((resolve, reject)=> {
            if (!moment(date, 'yyyy-MM-dd').isValid()) {
                reject("date isn't a valid date use the yyyy-MM-dd format");
            } else if (!moment(startTime, 'HH:mm').isValid()) {
                reject ("startTime isn't a valid time use the HH:mm format")
            } else if (!moment(endTime, 'HH:mm').isValid()) {
                reject ("endTime isn't a valid time use the HH:mm format")
            } else {
                ///1/user/-/activities/calories/date/2014-09-01/1d/15min/time/12:30/12:45.json
                //let stepsUrl = `https://api.fitbit.com/1/user/-/activities/steps/date/${date}/1d.json`;
                let stepsUrl = `https://api.fitbit.com/1/user/-/activities/steps/date/${date}/1d/15min/time/${startTime}/${endTime}.json`;

                axios.get(stepsUrl, {
                    headers: {
                        Authorization: 'Bearer ' + creditials.access_token 
                    }
                }).then((response) => {
                    resolve(response.data['activities-steps-intraday'].dataset);
                }).catch((error) => {
                    reject(error);
                })
            }
            
        })
    }
}

const formatHashFromUrl = (hash) => {
    hashkeyvalueparsed_json = {};
    hash.substring(1).split('&').forEach(function (x) {
        var arr = x.split('=');
        arr[1] && (hashkeyvalueparsed_json[arr[0]] = arr[1]);
    });
    return hashkeyvalueparsed_json;
}