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

ipcRenderer.on('py:status', (e, result) => {
    const red = '#bf2e3e';
    const orange = '#e67616';
    const yellow = '#f1bb33';
    const green = '#09a38c';

    let posture = document.getElementById('posture');
    let fatigue = document.getElementById('fatigue');
    let mood = document.getElementById('mood');

    // Set posture pot
    if (between(result.posture, 0.76, 1)) posture.style.borderColor = green;
    else if (between(result.posture, 0.51, 0.75)) posture.style.borderColor = yellow;
    else if (between(result.posture, 0.26, 0.5)) posture.style.borderColor = orange;
    else if (between(result.posture, 0, 0.25)) posture.style.borderColor = red;
    document.getElementById('postureText').innerText = result.postureText;

    // Set fatigue pot
    if (between(result.fatigue, 0.76, 1)) fatigue.style.borderColor = green;
    else if (between(result.fatigue, 0.51, 0.75)) fatigue.style.borderColor = yellow;
    else if (between(result.fatigue, 0.26, 0.5)) fatigue.style.borderColor = orange;
    else if (between(result.fatigue, 0, 0.25)) fatigue.style.borderColor = red;
    document.getElementById('fatigueText').innerText = result.fatigueText;

    // Set mood pot
    if (result.emotions.anger > 0) mood.style.borderColor = red;
    if (result.emotions.happy > 0) mood.style.borderColor = green;
    if (result.emotions.sadness > 0) mood.style.borderColor = orange;
    if (result.emotions.neutral > 0) mood.style.borderColor = yellow;
    document.getElementById('moodText').innerText = result.moodText;
});

ipcRenderer.on('py:measure_error', function(e, error){
    console.log(error)
});

function between(x, min, max) {
    return x >= min && x <= max;
}