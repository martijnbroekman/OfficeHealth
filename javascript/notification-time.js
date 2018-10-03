const electron = require('electron');
const events = require('events');
const fs = require('fs');

const { app, BrowserWindow, ipcMain } = electron;

const exerciseText = 'exercise';
const drowsinessText = 'drowsiness';
const postureText = 'posture';
const activityText = 'activity';

const jsonPath = 'goals.json';

const eventEmitter = new events.EventEmitter();

let exerciseInterval = null;
let drowsinessInterval = null;
let postureInterval = null;
let activityInterval = null;

let timing;

const exerciseTrigger = () => {
    consol.console.log('exercise triggert');
}

const drowsinessTrigger = () => {
    consol.console.log('drowsiness triggert');
}

const postureTrigger = () => {
    consol.console.log('posture triggert');
}

const activityTrigger = () => {
    consol.console.log('activity triggert');
}


const start = () => {
    console.log('started')
    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) {
            timing = {
                exercise: 3600000,
                drowsiness: 3600000,
                posture: 3600000,
                activity: 3600000
            }
            saveTiming();
        } else {
            timing = JSON.parse(data);
        }

        exerciseInterval = setInterval(exerciseTrigger, timing.exercise);
        drowsinessInterval = setInterval(drowsinessTrigger, timing.drowsiness);
        postureInterval = setInterval(postureTrigger, timing.posture);
        activityInterval = setInterval(activityTrigger, timing.activity);
    });
}

function saveTiming() {
    fs.writeFile(jsonPath, JSON.stringify(timing), (err) => {
        if (err) throw err;
    })
}

module.exports = {
    start: start,
    bindExercise: (callBack) => eventEmitter.on(exerciseText, callBack),
    binddrowsiness: (callBack) => eventEmitter.on(drowsinessText, callBack),
    bindposture: (callBack) => eventEmitter.on(postureText, callBack),
    bindactivity: (callBack) => eventEmitter.on(activityText, callBack),
}

ipcMain.on('goals:exercise', (event, miliseconds) => {
    
    timing.exercise = miliseconds;
    saveTiming();
    clearInterval(exerciseInterval);
    if (miliseconds === 'off') {
        exerciseInterval = null;
    } else if (miliseconds === 'on') {
        exerciseInterval = null;
    } else {
        exerciseInterval = setInterval(exerciseTrigger, miliseconds);
    }
});

ipcMain.on('goals:drowsiness', (event, miliseconds) => {
    timing.drowsiness = miliseconds;
    saveTiming();
    clearInterval(drowsinessInterval);
    drowsinessInterval = setInterval(drowsinessTrigger, miliseconds);
});

ipcMain.on('goals:posture', (event, miliseconds) => {
    timing.posture = miliseconds;
    saveTiming();
    clearInterval(postureInterval);
    postureInterval = setInterval(postureTrigger, miliseconds);
});

ipcMain.on('goals:activity', (event, miliseconds) => {
    timing.posture = miliseconds;
    saveTiming();
    clearInterval(activityInterval);
    activityInterval = setInterval(activityTrigger, miliseconds);
});

app.on('will-quit', () => {
    clearInterval(exerciseInterval);
    clearInterval(drowsinessInterval);
    clearInterval(postureInterval);
    clearInterval(activityInterval);
});