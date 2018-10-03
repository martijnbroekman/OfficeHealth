const electron = require('electron');
const path = require('path');
const fitbit = require('./javascript/fitbit.js');
const client = require('./javascript/zerorpc-client');
const EventEmitter = require('events').EventEmitter
const axios = require('axios');
const api = require('./javascript/api-service')
const notification = require('./javascript/notifications')
const pythonParsing = require('./javascript/python-parsing')
const fs = require('fs');

const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = electron;

const PY_DIST_FOLDER = 'dist';
const PY_FOLDER = 'api';
const PY_MODULE = 'api';

let currentUser = {};

let mainWinow = null;

const createWindow = () => {
    mainWinow = new BrowserWindow({
        width: 320,
        height: 390,
        resizable: false,
        icon: path.join(__dirname, 'icons/png/dark-icon-pngs/64x64.png')
    });

    mainWinow.loadURL(require('url').format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWinow.on('closed', () => {
        mainWinow = null
    });

    mainWinow.webContents.once('dom-ready', () => {
        setName(currentUser.name);
        api.getUser()
            .then(res => {
                fs.readFile('settings.json', 'utf8', (err, data) => {
                    if (!err) {
                        let settings = JSON.parse(data);
                        settings.canReceiveNotfications = res.canReceiveNotification;
                        fs.writeFile('settings.json', JSON.stringify(settings), (err) => {
                            if (err) throw err;
                        });
                    }
                });
                mainWinow.webContents.send('canReceiveNotification', res.canReceiveNotification);
            })
            .catch(error => console.log(error));
    });

    Menu.setApplicationMenu(null);

    const emitter = new EventEmitter();
    client.startMeasure(emitter);
    setInterval(() => {
        client.startMeasure(emitter);
    }, 8000);

    emitter.on('measure_result', (result) => {
        let parsedResult = JSON.parse(result);

        if (parsedResult !== null && parsedResult.face_detected !== false) {
            let resultObject = parsedResult.emotions;

            pythonParsing.ParseResults(parsedResult, (resultatos) => {
                mainWinow.webContents.send("py:status", resultatos);
            });
            //api.sendEmotion(resultObject)
            //    .then(() => {})
            //    .catch(error => console.log(error))

            pythonParsing.ParseResults(parsedResult, (resultatos) => {
                mainWinow.webContents.send("py:status", resultatos);
            });
        }
    });

    emitter.on('error', (error) => {
        mainWinow.webContents.send('py:measure_error', error);
    });
};

let settingsWindow = null;
const createSettingsWindow = () => {
    settingsWindow = new BrowserWindow({
        width: 320,
        height: 410,
        resizable: false,
        icon: path.join(__dirname, 'icons/png/dark-icon-pngs/64x64.png')
    });

    settingsWindow.loadURL(require('url').format({
        pathname: path.join(__dirname, 'settings.html'),
        protocol: 'file',
        slashes: true
    }));

    settingsWindow.on('closed', () => {
        settingsWindow = null
    });

    Menu.setApplicationMenu(null);

    fs.stat('settings.json', (err) => {
        if (!err) {
            fs.unlink('settings.json');
        }
    });
};

const startup = () => {
    const measureValues = {
        posture: 1,
        fatigue: 0.5,
        emotions: {
            anger: 0,
            neutral: 1,
            sadness: 0,
            disgust: 0,
            happy: 0,
            surprise: 0
        }
    };

    fs.writeFile('measure.json', JSON.stringify(measureValues), (err) => {
        if (err) {
            console.log(err)
        }
    });

    fs.readFile('./credentials.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            createSettingsWindow();
        } else {
            let dataObject = JSON.parse(data);
            currentUser = dataObject;
            api.login(dataObject.mail, dataObject.password)
                .then(() => {
                    createWindow()
                    setName(currentUser.name);
                })
                .catch(error => console.log(error));
        }
    });
}

api.onNotification(data => {
    notification.PushNotification(data.title, data.description)
        .then(res => {
            api.responseOnNotification(data.id, res === 'yes');
        })
        .catch(error => api.responseOnNotification(data.id, false));
});

api.onAccept(data => {
    notification.pushNotificationWithoutActions(data.title, data.text);
});

api.onDecline(data => {
    notification.pushNotificationWithoutActions(data.title, data.text);
});

app.on('ready', startup);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWinow === null) {
        initApp();
    }
});

let pyProc = null;
let pyPort = null;

const selectPort = () => {
    pyPort = 4242;
    return pyPort;
};

const pythonExec = path.join(__dirname, 'python_modules', 'env', 'bin', 'python');

const createPyProc = () => {
    let script = getScriptPath();
    let port = '' + selectPort();

    if (guessPackaged()) {
        pyProc = require('child_process').execFile(script, [port])
      } else {
        pyProc = require('child_process').spawn(pythonExec, [script, port])
      }

    if (pyPort != null) {
        console.log('child process success')
    }

    client.start();
};

const guessPackaged = () => {
    const fullPath = path.join(__dirname, PY_DIST_FOLDER);
    return require('fs').existsSync(fullPath);
}

const getScriptPath = () => {
    if (!guessPackaged()) {
        return path.join(__dirname, 'python_modules', PY_FOLDER + '.py')
    }
    if (process.platform === 'win32') {
        return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
    }
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const exitPyProc = () => {
    pyProc.kill();
    pyProc = null;
    pyPort = null;
};

app.on('ready', createPyProc);
app.on('will-quit', exitPyProc);

ipcMain.on('fitbit:signin', (event) => {
    fitbit.fitbitSignIn()
        .then((res) => {
            console.log(res)
        }).catch((error) => {
            console.log(error);
        })
});


ipcMain.on('settings:login', (event, creditials) => {
    api.register(creditials.mail, creditials.name, creditials.password, creditials.type)
        .then(res => {
            currentUser = creditials;
            fs.writeFile('credentials.json', JSON.stringify(creditials), (err) => {
                if (err) throw err;
            });
            createWindow();
            settingsWindow.close();
            settingsWindow = null;
        })
        .catch(error => {
            console.log(error)
            settingsWindow.webContents.send('settings:failed', error.response.data);
        })
});

ipcMain.on('mute', (event, arg) => {
    api.changeNotificationStatus(arg);

    fs.readFile('settings.json', 'utf8', (err, data) => {
        if (!err) {
            let settings = JSON.parse(data);
            settings.canReceiveNotfications = arg;
            fs.writeFile('settings.json', JSON.stringify(settings), (err) => {
                if (err) throw err;
            });
        }
    });
});

ipcMain.on('start_camera', (event) => {
    client.start_camera();
    event.sender.send('camera_started');
});

ipcMain.on('capture', (event) => {
    client.capture().then(() => {
        event.sender.send('proceed_login');
    }).catch((error) => {
        console.log(error);
    });
});

function setName(name) {
    mainWinow.webContents.send('settings:name', name);
}
