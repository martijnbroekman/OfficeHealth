const path = require('path');
const notifications = require( 'freedesktop-notifications' );

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

module.exports = {
    PushNotification: pushNotification
};