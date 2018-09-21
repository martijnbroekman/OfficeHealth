const electron = require('electron');
const path = require('path');
const fitbit = require('./javascript/fitbit.js');
const client = require('./javascript/zerorpc-client');
const EventEmitter = require('events').EventEmitter

const { app, BrowserWindow, ipcMain } = electron;

let mainWinow = null;
const createWindow = () => {
    mainWinow = new BrowserWindow({width: 800, height: 600});
    mainWinow.loadURL(require('url').format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWinow.on('closed', () => {
        mainWinow = null
    });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWinow === null) {
        createWindow();
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
        console.log(res)
        if (JSON.parse(res).ready) {
            client.startMeasure(emitter);
        }
    });

    emitter.on('measure_result', (result) => {
        mainWinow.webContents.send('py:measure', result);
    });

    emitter.on('error', (error) => {
        mainWinow.webContents.send('py:measure_error', error);
    })
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
