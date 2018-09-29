const fs = require('fs');
const notification = require('./notifications');

const parseResults = (results, callback) => {
    let currentValues;

    fs.readFile('./measure.json', 'utf8', (err, data) => {
        if (err) throw err;
        currentValues = JSON.parse(data);

        const resultObject = results;

        // Calculate new posture scores
        switch (resultObject.posture) {
            case 1:
                currentValues.posture = Math.min(1, currentValues.posture + 0.2);
                break;
            case 2:
                currentValues.posture = Math.min(1, currentValues.posture + 0.1);
                break;
            case 3:
                currentValues.posture = Math.max(0, currentValues.posture - 0.1);
                break;
            case 4:
                currentValues.posture = Math.max(0, currentValues.posture - 0.2);
                break;
            default: break;
        }


        fs.readFile('settings.json', 'utf8', (err, data) => {
            if (!err && JSON.parse(data).canReceiveNotfications) {
                postureNotification(currentValues.posture);
            }
        });

        // Calculate new fatigue score
        currentValues.fatigue = resultObject.fatigue ? Math.max(0, currentValues.fatigue - 0.1) : Math.min(1, currentValues.fatigue + 0.1);

        const measuredEmotions = resultObject.emotions;
        let currentEmotions = currentValues.emotions;

        // Calculate new emotion scores       
        currentEmotions.sadness = measuredEmotions.sadness > 0.2 ? Math.min(1, currentEmotions.sadness + 0.2) : Math.max(0, currentEmotions.sadness - 0.2);
        currentEmotions.anger = measuredEmotions.anger > 0.1 ? Math.min(1, currentEmotions.anger + 0.15) : Math.max(0, currentEmotions.anger - 0.15);
        currentEmotions.disgust = measuredEmotions.disgust > 0.2 ? Math.min(1, currentEmotions.disgust + 0.1) : Math.max(0, currentEmotions.disgust - 0.1);
        currentEmotions.happy = measuredEmotions.happiness > 0.2 ? Math.min(1, currentEmotions.happy + 0.2) : Math.max(0, currentEmotions.happy - 0.2);
        currentEmotions.surprise = measuredEmotions.surprise > 0.2 ? Math.min(1, currentEmotions.surprise + 0.15) : Math.max(0, currentEmotions.surprise - 0.15);
        currentEmotions.neutral = measuredEmotions.neutral > 0.2 ? Math.min(1, currentEmotions.neutral + 0.1) : Math.max(0, currentEmotions.neutral - 0.1);

        fs.writeFile('measure.json', JSON.stringify(currentValues), (err) => {
            if (err) throw err;
        });

        setStatusDescription(currentValues, (callback))
    });
};

const setStatusDescription = (values, callback) => {
    fs.readFile('./info/status.json', 'utf8', (err, data) => {
        if (err) throw err;

        const statusTexts = JSON.parse(data);

        // Set posture text
        if (between(values.posture, 0.76, 1)) values.postureText = statusTexts.posture.green;
        else if (between(values.posture, 0.51, 0.75)) values.postureText = statusTexts.posture.yellow;
        else if (between(values.posture, 0.26, 0.5)) values.postureText = statusTexts.posture.orange;
        else if (between(values.posture, 0, 0.25)) values.postureText = statusTexts.posture.red;

        // Set fatigue text
        if (between(values.fatigue, 0.76, 1)) values.fatigueText = statusTexts.fatigue.green;
        else if (between(values.fatigue, 0.51, 0.75)) values.fatigueText = statusTexts.fatigue.yellow;
        else if (between(values.fatigue, 0.26, 0.5)) values.fatigueText = statusTexts.fatigue.orange;
        else if (between(values.fatigue, 0, 0.25)) values.fatigueText = statusTexts.fatigue.red;

        // Set mood text
        if (values.emotions.anger > 0) values.moodText = statusTexts.mood.red;
        else if (values.emotions.happy > 0) values.moodText = statusTexts.mood.green;
        else if (values.emotions.sadness > 0) values.moodText = statusTexts.mood.orange;
        else if (values.emotions.neutral > 0) values.moodText = statusTexts.mood.yellow;

        callback(values);
    });
}

function postureNotification(score) {
    if (score <= 0.25) {
        notification.pushNotificationWithoutActions("Pots", "Zithouding heeft invloed op je gezondheid. Ook al is het soms lastig, rechtop zitten helpt!");
    } else if (score >= 0.26 && score <= 0.5) {
        notification.pushNotificationWithoutActions("Pots", "Je zat erg goed! Probeer het vol te houden.");
    }
}

function between(x, min, max) {
    return x >= min && x <= max;
}

module.exports = {
    ParseResults: parseResults,
};