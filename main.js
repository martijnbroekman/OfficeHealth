const electron = require('electron');
const path = require('path');
const fitbit = require('./javascript/fitbit.js');
const client = require('./javascript/python-client');
const EventEmitter = require('events').EventEmitter
const api = require('./javascript/api-service')
const notification = require('./javascript/notifications')
const pythonParsing = require('./javascript/python-parsing')
const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
    return `${info.level}: ${info.timestamp} - ${info.message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'pots-log.log' })
    ]
});

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
    logger.info('Main application started');
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
        setPots();
        api.getUser()
            .then(res => {
                fs.readFile('settings.json', 'utf8', (err, data) => {
                    if (!err) {
                        let settings = JSON.parse(data);
                        settings.canReceiveNotfications = res.canReceiveNotification;
                        fs.writeFile('settings.json', JSON.stringify(settings), (err) => {
                            if (err) logger.error(`Error: ${err} occured on writing settingsfile`);
                        });
                    }
                });
                mainWinow.webContents.send('canReceiveNotification', res.canReceiveNotification);
            })
            .catch(error => logger.error(`Error: ${error} occured on getting user`));


    });

    Menu.setApplicationMenu(null);

    const emitter = new EventEmitter();
    setInterval(() => {
        client.startMeasure().then(res => {
            emitter.emit('measure_result', res);
        }).catch(error => console.log(error));
    }, 8000);

    emitter.on('measure_result', (result) => {
        let parsedResult = result;

        if (parsedResult !== null && parsedResult.face_detected !== false) {
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
    logger.info('Settings window started');
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
    logger.info('Startup function invoked');
    const measureValues = {
        posture: 1,
        fatigue: 0.8,
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
            logger.error(`Error ${err} occured on reading credentials file`);
            createSettingsWindow();
        } else {
            let dataObject = JSON.parse(data);
            currentUser = dataObject;
            api.login(dataObject.mail, dataObject.password)
                .then(() => {
                    createWindow();
                })
                .catch(error => logger.error(`Error ${error} occured on login`));
        }
    });
}

api.onNotification(data => {
    notification.PushNotification(data.title, data.description)
        .then(res => {
            api.responseOnNotification(data.id, res === 'yes');
        })
        .catch(error => {
            api.responseOnNotification(data.id, false);
            logger.error(`Error: ${error} occured on notification`);
        });
});

api.onAccept(data => {
    notification.pushNotificationWithoutActions(data.title, data.text);
    logger.info(`Event with title: ${data.title} accepted`);
});

api.onDecline(data => {
    notification.pushNotificationWithoutActions(data.title, data.text);
    logger.info(`Event with title: ${data.title} declined`);
});

app.on('ready', startup);

app.on('window-all-closed', () => {
    logger.info(`Application closed`);
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
    pyPort = 5000;
    return pyPort;
};

const pythonExec = path.join(__dirname, 'python_modules', 'env', 'bin', 'python');

const createPyProc = () => {
    let script = getScriptPath();
    let port = '' + selectPort();

    if (guessPackaged()) {
        pyProc = require('child_process').execFile(script, [port]);
        logger.info('Executed executable');
    } else {
        pyProc = require('child_process').spawn(pythonExec, [script, port]);
        logger.info('Executed py file');
    }
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
    logger.info("Python process killed");
};

app.on('ready', createPyProc);
app.on('will-quit', exitPyProc);

ipcMain.on('fitbit:signin', (event) => {
    fitbit.fitbitSignIn()
        .then((res) => {
            logger.info("Fitbit signin succeeded");
        }).catch((error) => {
            logger.error(`${error} occured on Fitbit signin`)
        });
});


ipcMain.on('settings:login', (event, creditials) => {
    logger.info('Settings login');
    api.register(creditials.mail, creditials.name, creditials.password, creditials.type)
        .then(res => {
            currentUser = creditials;
            fs.writeFile('credentials.json', JSON.stringify(creditials), (err) => {
                logger.error(`Error: ${err} occured on writing credentials file on login`);
            });
            createWindow();
            settingsWindow.close();
            logger.info("Settings windows closed after login");
            settingsWindow = null;
        })
        .catch(error => {
            logger.error(`Error: ${error} occured on registration`);
            settingsWindow.webContents.send('settings:failed', error.response.data);
        })
});

ipcMain.on('mute', (event, arg) => {
    api.changeNotificationStatus(arg);
    logger.info("Muting notification on server invoked");

    fs.readFile('settings.json', 'utf8', (err, data) => {
        if (!err) {
            let settings = JSON.parse(data);
            settings.canReceiveNotfications = arg;
            fs.writeFile('settings.json', JSON.stringify(settings), (err) => {
                if (err) logger.error(`Error: ${err} occured on writing muting status to file`);
                logger.info("Muting notifications local");
            });
        }
    });
});

ipcMain.on('start_camera', (event) => {
    logger.info("Invoked starting camera");
    client.start_camera()
        .then(event.sender.send('camera_started')).catch(error => logger.error(`Error: ${error} occured on invoking start camera`));
});

ipcMain.on('capture', (event) => {
    logger.info("Capture invoked")
    client.capture().then(() => {
        settingsExists(() => {
            event.sender.send('proceed_login');
        });
    }).catch((error) => {
        logger.error(`Error: ${error} occured on invoking capture`);
    });
});

function settingsExists(callback) {
    fs.stat('settings.json', (err) => {
        if (err) settingsExists(callback);
        callback(true);
    });
}

function setName(name) {
    mainWinow.webContents.send('settings:name', name);
}

function setPots() {
    logger.info('Initial pots set');
    fs.readFile('measure.json', 'utf8', (err, data) => {
        if (!err) {
            pythonParsing.SetStatusDescription(JSON.parse(data), (result) => {
                mainWinow.webContents.send("py:status", result);
            });
        } else {
            logger.error(`Error: ${err} occured on reading file on setPots`);
        }
    });
}
