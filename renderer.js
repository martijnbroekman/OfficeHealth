electron = require('electron')

const { ipcRenderer } = electron;

module.exports = {
    fitbitSignin: function() {
        ipcRenderer.send('fitbit:signin');
    }
}

ipcRenderer.on('py:posture', function(e, res){
    console.log('posture: ', res)
});

ipcRenderer.on('py:emotions', function(e, res){
    console.log('emotions: ', res)
});

ipcRenderer.on('py:drowsiness', function(e, res){
    console.log('drowsiness: ', res)
});

ipcRenderer.on('py:stress', function(e, res){
    console.log('stress: ', res)
});