electron = require('electron');

const { ipcRenderer } = electron;
let currentTiming;

const setupSliders = () => {
    setValue(currentTiming.exercise, 'exerciseRange');
    setValue(currentTiming.drowsiness, 'drowsinessRange');
    setValue(currentTiming.posture, 'postureRange');
    setValue(currentTiming.activity, 'activityRange');

    let exerciseSlider = document.getElementById("exerciseRange");
    let drowsinessSlider = document.getElementById("drowsinessRange");
    let postureSlider = document.getElementById("postureRange");
    let socialSlider = document.getElementById("activityRange");
    
    exerciseSlider.oninput = handleOnChange;
    drowsinessSlider.oninput = handleOnChange;
    postureSlider.oninput = handleOnChange;
    socialSlider.oninput = handleOnChange;
}

const handleOnChange = (e) => {
    let element = e.target

    let value = parseInt(element.value);
    let min = parseInt(element.getAttribute("min"));
    let max = parseInt(element.getAttribute("max"));
    let tumbWidth = 15;

    let range = max - min;
    let position = ((value - min) / range) * 100;
    let positionOffset = Math.round(tumbWidth * position / 100) - (tumbWidth / 2)

    let output = document.getElementById(element.id + "Output");
    output.style.left = 'calc(' + position + '% - ' + positionOffset + 'px)';

    let text = ''
    let name = element.id.replace('Range', '')
    switch (value) {
        case 1:
            text = 'off';
            ipcRenderer.send('goals:' + name, 'off');
        break;
        case 2:
            text = '2 hour';
            ipcRenderer.send('goals:' + name, 1000);//7200000);
        break;
        case 3:
            text = '1 hour';
            ipcRenderer.send('goals:' + name, 3600000);
        break;
        case 4:
            text = '30 min';
            ipcRenderer.send('goals:' + name, 1800000);
        break;
        case 5:
            text = 'on';
            ipcRenderer.send('goals:' + name, 'on');
        break;
        default:
            text = value;
    }

    currentTiming[name] = text;
    output.innerText = text;
}

ipcRenderer.on('goals:timing', function(e, timing){
    currentTiming = timing;
});

function setValue(value, id) {
    let element = document.getElementById(id);

    switch (value) {
        case 'off':
            element.value = 1;
        break;
        case 1000://7200000
            element.value = 2;
        break;
        case 3600000:
            console.log('test');
            element.value = 3;
        break;
        case 1800000:
            element.value = 4;
        break;
        case 'on':
            element.value = 5;
        break;
        default:
            element.value = 3;
    }
}


module.exports = {
    setupSliders: setupSliders
}