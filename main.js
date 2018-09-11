const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')

let mainWinow = null
const createWindow = () => {
    mainWinow = new BrowserWindow({width: 800, height: 600})
    mainWinow.loadURL(require('url').format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))
    mainWinow.webContents.openDevTools()
    mainWinow.on('closed', () => {
        mainWinow = null
    })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (mainWinow === null) {
        createWindow()
    }
})

let pyProc = null
let pyPort = null

const selectPort = () => {
    pyPort = 4242
    return pyPort
}

const createPyProc = () => {
    let port = '' + selectPort()
    let script = path.join(__dirname, 'python_modules', 'api.py')
    pyProc = require('child_process').spawn('python3', [script, port])
    if (pyPort != null) {
        console.log('child process success')
    }
} 

const exitPyProc = () => {
    pyProc.kill()
    pyProc = null
    pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)