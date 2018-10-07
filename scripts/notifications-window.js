const electron = require('electron');
const {ipcRenderer} = electron;

const clickYes = () => {
    ipcRenderer.send('notification:yes');
};

const clickNo = () => {
    ipcRenderer.send('notification:no');
};

const setContent = (gifPath, message) => {
    console.log("wow");
    document.getElementById("gif").src = gifPath;
    document.getElementById("message").innerHTML = message;
};


document.getElementById("btnYes").addEventListener('click', clickYes);
document.getElementById("btnNo").addEventListener('click', clickNo);

ipcRenderer.on('notification:content', function(e, gifPath, message){
    setContent(gifPath, message);
});



