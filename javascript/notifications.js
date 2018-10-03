const electron = require('electron');
const path = require('path');
const notifications = require( 'freedesktop-notifications' );

const {
    BrowserWindow,
    Menu
} = electron;

// Construct and push notification
const pushNotification = (title, message) => {
    return new Promise ((resolve, reject) => {
        let notif = notifications.createNotification( {
            summary: title ,
            body: message,
            icon: path.join(__dirname, '../img/pots-logo.png'),
            actions: {
                default: '' ,
                yes: 'Yes!' ,
                no: 'Not now!'
            }
        } ) ;
         
        notif.on( 'action' , function( action ) {
            console.log( "Action '%s' was clicked!" , action ) ;
            resolve(action);
        } ) ;
         
        notif.on( 'close' , function( closedBy ) {
            console.log( "Closed by: '%s'" , closedBy ) ;
            reject(closedBy);
        } ) ;
         
        notif.push() ;
    })
};

// Construct and push notification
const pushNotificationWithoutActions = (title, message) => {

    let notif = notifications.createNotification( {
        summary: title ,
        body: message,
        icon: path.join(__dirname, '../img/pots-logo.png'),
    });

    notif.push();
};

let notificationWindow = null;
const createNotificationWindow = () => {
    let notificationWidth = 320;
    let notificationHeight = 320;
    let xPosition = electron.screen.getPrimaryDisplay().bounds.width - notificationWidth - 15;
    let yPosition = electron.screen.getPrimaryDisplay().bounds.height - notificationHeight - 15;
    
    notificationWindow = new BrowserWindow({
        width: notificationWidth,
        height: notificationHeight,
        x: xPosition,
        y: yPosition,
        resizable: false,
        frame: false,
        icon: path.join(__dirname, '../icons/png/dark-icon-pngs/64x64.png')
    });

    notificationWindow.loadURL(require('url').format({
        pathname: path.join(__dirname, '../html/notification.html'),
        protocol: 'file',
        slashes: true
    }));

    notificationWindow.on('closed', () => {
        notificationWindow = null
    });

    Menu.setApplicationMenu(null);
};

module.exports = {
    PushNotification: pushNotification,
    pushNotificationWithoutActions: pushNotificationWithoutActions,
    createNotificationWindow: createNotificationWindow
};