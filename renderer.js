electron = require('electron')

const { ipcRenderer } = electron;

const red = '#bf2e3e';
const orange = '#e67616';
const yellow = '#f1bb33';
const green = '#09a38c';
const blue = '#8396f1';



module.exports = {
    fitbitSignin: function() {
        ipcRenderer.send('fitbit:signin');
    }
}

ipcRenderer.on('py:measure', function(e, result){
    console.log(result)
});

ipcRenderer.on('py:status', (e, result) => {
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

    console.log(result);
    // Set mood pot
    if (result.emotions.anger > 0) mood.style.borderColor = red;
    else if (result.emotions.happy > 0) mood.style.borderColor = green;
    else if (result.emotions.sadness > 0) mood.style.borderColor = orange;
    else if (result.emotions.neutral > 0) mood.style.borderColor = blue;
    document.getElementById('moodText').innerText = result.moodText;
});

ipcRenderer.on('fitbit:steps', (e, result) => {
    let steps = document.getElementById('steps');

    if (between(result, 0, 2500)) steps.style.borderColor = red;
    else if (between(result, 2501, 5000)) steps.style.borderColor = orange;
    else if (between(result, 5001, 7500)) steps.style.borderColor = yellow;
    else if (result > 7501) steps.style.borderColor = green;

    let textElement = document.getElementById('stepsText');
    if (result < 10000) {
        textElement.innerText = `Nog ${10000 - result} om je doel voor vandaag te halen`;
    } else {
        textElement.innerText = `Je hebt je doel bereikt van 10.000 stappen`;
    }
    
    document.getElementById('stepsContainer').style.display = '';
});

ipcRenderer.on('py:measure_error', function(e, error){
    console.log(error)
});


ipcRenderer.on('settings:name', function(e, name) {
    console.log(name)
    document.getElementById('profileName').innerText = name;
});

ipcRenderer.on('canReceiveNotification', function(e, canReceiveNotification) {
    if (!canReceiveNotification) {
        ipcRenderer.send("mute", false);
        document.getElementById('notifications').src = "icons/png/notifcations-muted.png";
    } else {
        ipcRenderer.send("mute", true);
        document.getElementById('notifications').src = "icons/png/notifcations.png";
    }
});

function between(x, min, max) {
    return x >= min && x <= max;
}