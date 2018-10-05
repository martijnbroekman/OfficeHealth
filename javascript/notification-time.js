const electron = require('electron');
const events = require('events');
const fs = require('fs');

const { app, BrowserWindow, ipcMain } = electron;

const exerciseText = 'exercise';
const drowsinessText = 'drowsiness';
const postureText = 'posture';
const activityText = 'activity';

const jsonPath = 'goals.json';

let timing;

class Trigger {
    constructor(type, timing) {
        this._type = type;
        this._timing = timing;
        this._notificationAllowed = timing === 'on';
        this._interval = setInterval(this.trigger.bind(this), timing)
    }

    get notificationAllowed() {
        let current = this._notificationAllowed;
        if (this.timing !== 'on' || this.timing !== 'off') {
            this._notificationAllowed = false;
        }
        
        return current;
    }

    set notificationAllowed(notificationAllowed) {
        this._notificationAllowed = notificationAllowed;
    }

    get timing() {
        return this._timing;
    }

    set timing(timing) {
        clearInterval(this._interval);
        if (timing === 'on') {
            this.notificationAllowed = true;
        } else if (timing === 'off') {
            this.notificationAllowed = false;
        } else {
            this._interval = setInterval(this.trigger.bind(this), timing);
        }
        this._timing = timing;
    }

    set callback(callback) {
        this._callback = callback;
    }

    trigger() {
        this.notificationAllowed = true;
        if (this._callback != undefined) {
            this._callback();
        }
    }

    clear() {
        clearInterval(this._interval);
    }
}

let exerciseTrigger = null;
let drowsinessTrigger = null;
let postureTrigger = null;
let activityTrigger = null;

const start = () => {
    return new Promise((resolve, reject) => {
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
    
            exerciseTrigger = new Trigger('exercise', timing.exercise);
            drowsinessTrigger = new Trigger('drowsiness', timing.drowsiness);
            postureTrigger = new Trigger('posture', timing.posture);
            activityTrigger = new Trigger('activity', timing.activity);

            resolve();
        });
    })
}

function saveTiming() {
    fs.writeFile(jsonPath, JSON.stringify(timing), (err) => {
        if (err) throw err;
    })
}

module.exports = {
    start: start,
    exerciseNotificationAllowed: () => exerciseTrigger.notificationAllowed,
    drowsinessNotificationAllowed: () => drowsinessTrigger.notificationAllowed,
    postureNotificationAllowed: () => postureTrigger.notificationAllowed,
    activityNotificationAllowed: () => activityTrigger.notificationAllowed,
    setExerciseCallback: (callback) => exerciseTrigger.callback = callback,
    setActivityCallback: (callback) => activityTrigger.callback = callback
}

ipcMain.on('goals:exercise', (event, miliseconds) => {
    exerciseTrigger.timing = miliseconds;
    timing.exercise = miliseconds;
    saveTiming();
});

ipcMain.on('goals:drowsiness', (event, miliseconds) => {
    drowsinessTrigger.timing = miliseconds;
    timing.drowsiness = miliseconds;
    saveTiming();
});

ipcMain.on('goals:posture', (event, miliseconds) => {
    postureTrigger.timing = miliseconds;
    timing.posture = miliseconds;
    saveTiming();
});

ipcMain.on('goals:activity', (event, miliseconds) => {
    activityTrigger.timing = miliseconds
    timing.posture = miliseconds;
    saveTiming();
});

app.on('will-quit', () => {
    exerciseTrigger.clear();
    drowsinessTrigger.clear();
    postureTrigger.clear();
    activityTrigger.clear();
});