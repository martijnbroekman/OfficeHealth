const electron = require('electron');
const path = require('path');
const fitbit = require('./javascript/fitbit.js');
const client = require('./javascript/zerorpc-client');
const EventEmitter = require('events').EventEmitter
const axios = require('axios');
const notifications = require('./javascript/notifications')
const pythonParsing = require('./javascript/python-parsing')
const fs = require('fs');

const {
    app,
    BrowserWindow,
    ipcMain
} = electron;

let mainWinow = null;

const initApp = () => {
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

    const measureValues = {
        posture: 1,
        fatigue: 1,
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
}

app.on('ready', initApp);
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
const script = path.join(__dirname, 'python_modules', 'api.py')

const createPyProc = () => {
    let port = '' + selectPort()

    pyProc = require('child_process').spawn(pythonExec, [script, port])
    if (pyPort != null) {
        console.log('child process success')
    }

    const emitter = new EventEmitter();
    client.start().then((res) => {
        if (JSON.parse(res).ready) {
            client.startMeasure(emitter);
        }
    }).catch((error) => {
        console.log(`Error: ${error}`)
    });

    emitter.on('measure_result', (result) => {
        let parsedResult = JSON.parse(result);

        if (parsedResult !== null && parsedResult.face_detected !== false) {
            pythonParsing.ParseResults(parsedResult, (resultatos) => {
                mainWinow.webContents.send("py:status", resultatos);
            });
            // let resultObject = parsedResult.emotions;
            // resultObject.userId = 1;
            // axios.post('http://localhost:5000/emotions', resultObject)
            // .then((res) => {
                
            // })
            // .catch((error) => {
            //     console.log(error)
            // });
        }
    });

    emitter.on('error', (error) => {
        mainWinow.webContents.send('py:measure_error', error);
    });
};

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
