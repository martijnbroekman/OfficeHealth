electron = require('electron')

const { ipcRenderer } = electron;

module.exports = {
    fitbitSignin: function() {
        ipcRenderer.send('fitbit:signin');
    }
}

ipcRenderer.on('py:measure', function(e, result){
    console.log(result)
});

ipcRenderer.on('py:measure_error', function(e, error){
    console.log(error)
});