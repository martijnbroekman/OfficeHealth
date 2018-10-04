const electron = require('electron');
const events = require('events');
const fs = require('fs');

const { app, BrowserWindow, ipcMain } = electron;

const exerciseText = 'exercise';
const drowsinessText = 'drowsiness';
const postureText = 'posture';
const activityText = 'activity';

const jsonPath = 'goals.json';

let exerciseInterval = null;
let drowsinessInterval = null;
let postureInterval = null;
let activityInterval = null;

let timing;

let exerciseNotificationAllowed = false;
let drowsinessNotificationAllowed = false;
let postureNotificationAllowed = false;
let activityNotificationAllowed = false;

const exerciseTrigger = () => {
    console.log('exercise triggert');
    exerciseNotificationAllowed = true;
}

const drowsinessTrigger = () => {
    console.log('drowsiness triggert');
    drowsinessNotificationAllowed = true;
}

const postureTrigger = () => {
    console.log('posture triggert');
    postureNotificationAllowed = true;
}

const activityTrigger = () => {
    console.log('activity triggert');
    activityNotificationAllowed = true;
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

        exerciseInterval = setTrigger(exerciseTrigger, timing.exercise);
        drowsinessInterval = setTrigger(drowsinessTrigger, timing.drowsiness);
        postureInterval = setTrigger(postureTrigger, timing.posture);
        activityInterval = setTrigger(activityTrigger, timing.activity);
    });
}

function setTrigger(trigger, time) {
    console.log(time)
    if (time !== 'on' && time !== 'off') {
        return setInterval(trigger, time);
    }
    return null;
}

function saveTiming() {
    fs.writeFile(jsonPath, JSON.stringify(timing), (err) => {
        if (err) throw err;
    })
}

module.exports = {
    start: start,
    exerciseNotificationAllowed: () => {
        if (timing.exercise === 'on') {
            return true;
        }
        if (timing.exercise === 'off') {
            return false;
        }
        let current = exerciseNotificationAllowed;
        exerciseNotificationAllowed = false;

        return current;
    },
    drowsinessNotificationAllowed: () => {
        if (timing.drowsiness === 'on') {
            return true;
        }
        if (timing.drowsiness === 'off') {
            return false;
        }
        let current = drowsinessNotificationAllowed;
        drowsinessNotificationAllowed = false;

        return current;
    },
    postureNotificationAllowed: () => {
        if (timing.posture === 'on') {
            return true;
        }
        if (timing.posture === 'off') {
            return false;
        }
        let current = postureNotificationAllowed;
        postureNotificationAllowed = false;

        return current;
    },
    activityNotificationAllowed: () => {
        if (timing.activity === 'on') {
            return true;
        }
        if (timing.activity === 'off') {
            return false;
        }
        let current = activityNotificationAllowed;
        activityNotificationAllowed = false;

        return current;
    }
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
    if (miliseconds === 'off') {
        drowsinessInterval = null;
    } else if (miliseconds === 'on') {
        drowsinessInterval = null;
    } else {
        drowsinessInterval = setInterval(drowsinessTrigger, miliseconds);
    }
});

ipcMain.on('goals:posture', (event, miliseconds) => {
    timing.posture = miliseconds;
    saveTiming();
    clearInterval(postureInterval);
    if (miliseconds === 'off') {
        postureInterval = null;
    } else if (miliseconds === 'on') {
        postureInterval = null;
    } else {
        postureInterval = setInterval(postureTrigger, miliseconds);
    }
});

ipcMain.on('goals:activity', (event, miliseconds) => {
    timing.posture = miliseconds;
    saveTiming();
    clearInterval(activityInterval);
    if (miliseconds === 'off') {
        activityInterval = null;
    } else if (miliseconds === 'on') {
        activityInterval = null;
    } else {
        activityInterval = setInterval(activityTrigger, miliseconds);
    }
});

app.on('will-quit', () => {
    clearInterval(exerciseInterval);
    clearInterval(drowsinessInterval);
    clearInterval(postureInterval);
    clearInterval(activityInterval);
});