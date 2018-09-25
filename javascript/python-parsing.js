const parseResults = (results) => {
    const resultObject = JSON.parse(results);

    // Calculate new posture scores
    switch(resultObject.posture) {
        case 1 :
            currentValues.posture += 0.2;
            break;
        case 2:
            currentValues.posture += 0.1;
            break;
        case 3:
            currentValues.posture -= 0.1;
            break;
        case 4:
            currentValues.posture -= 0.2;
            break;
        default: break;
    }

    // Calculate new fatigue score
    resultObject.fatigue ? currentValues.fatigue += 0.1 : currentValues.fatigue -= 0.1;

    // Calculate emotion score
    const emotions = resultObject.emotions;
    
    if (emotions.sadness > 0.5) {
        currentValues.emotions.sadness -= 0.2
    }

    if (emotions.anger > 0.5) {
        currentValues.emotions.anger -= 0.15;
    }

    if (emotions.disgust > 0.5) {
        currentValues.emotions.disgust -= 0.1;
    }

    if (emotions.happy > 0.5) {
        currentValues.emotions.happy += 0.2;
    }

    if (emotions.surprise > 0.5) {
        currentValues.emotions.surprise += 0.15;
    }

    if (emotions.neutral > 0.5) {
        if (currentValues.emotions.neutral < 0.6) {
            currentValues.emotions.neutral += 0.1;
        } else {
            currentValues.emotions.neutral -= 0.1;
        }
    }

    return currentValues;
}

module.exports = {
    ParseResults = parseResults
};