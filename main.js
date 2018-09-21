const electron = require('electron');
const path = require('path');
const fitbit = require('./javascript/fitbit.js');
const server = require('./javascript/zerorpc-server');
const client = require('./javascript/zerorpc-client');
var path = require('path')

const {
    app,
    BrowserWindow,
    ipcMain
} = electron;

let mainWinow = null;
const createWindow = () => {
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

    //pyProc = require('child_process').spawn(pythonExec, [script, port])
    if (pyPort != null) {
        console.log('child process success')
    }

    //server.start(postureCallback, emotionsCallback, drowsinessCallback, stressCallback);
    //client.start().then((res)=> console.log(res));
};

const exitPyProc = () => {
    //pyProc.kill();
    pyProc = null;
    pyPort = null;
};

app.on('ready', createPyProc);
app.on('will-quit', exitPyProc);

const postureCallback = (res) => {
    mainWinow.webContents.send('py:posture', res);
}

const emotionsCallback = (res) => {
    mainWinow.webContents.send('py:emotions', res);
}

const drowsinessCallback = (res) => {
    mainWinow.webContents.send('py:drowsiness', res);
}

const stressCallback = (res) => {
    mainWinow.webContents.send('py:stress', res);
}

ipcMain.on('fitbit:signin', (event) => {
    fitbit.fitbitSignIn()
        .then((res) => {
            console.log(res)
        }).catch((error) => {
            console.log(error);
        })
});
