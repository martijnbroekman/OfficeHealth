const electron = require('electron');
const path = require('path');
const fitbit = require('./javascript/fitbit.js');

const { app, BrowserWindow } = electron;

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

    fitbit.fitbitSignIn().then(function(val){
        fitbit.getHeartBeat('2018-09-11', '10:00', '11:00').then(function(val){
            console.log(val);
        }).catch(function(err){

        });

        fitbit.getSteps('2018-09-11').then(function(val){
            console.log('steps');
            console.log(val);
        }).catch(function(err){

        });
    }).catch(function(err){
        console.log(err);
    });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (mainWinow === null) {
        createWindow()
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
    let port = '' + selectPort()
    let script = path.join(__dirname, 'python_modules', 'drowsiness_detect.py')
    pyProc = require('child_process').spawn(pythonExec, [script, port])
    if (pyPort != null) {
        console.log('child process success')
    }
};

const exitPyProc = () => {
    pyProc.kill();
    pyProc = null;
    pyPort = null;
};

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)