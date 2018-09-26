const fs = require('fs');

const parseResults = (results, callback) => {
    let currentValues;

    fs.readFile('./measure.json', 'utf8', (err, data) => {  
        if (err) throw err;
        currentValues = JSON.parse(data);

        const resultObject = results;

        // Calculate new posture scores
        switch(resultObject.posture) {
            case 1 :
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
            if (err) {
                console.log(err)
            }
        });
    
        callback(currentValues);
    });
};

module.exports = {
    ParseResults: parseResults
};