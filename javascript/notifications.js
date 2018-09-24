const signalR = require("@aspnet/signalr");
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.WebSocket = require('websocket').w3cwebsocket;
 
let connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/hubs/notifications?token=eyJhbGciOiJSUzI1NiIsImtpZCI6IkxTSEdSS0tCOEM4TldGOU9WQVdCNVBRSUtFSkVYTUkyNUdUMkhGNkEiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiI0IiwibmFtZSI6InRlc3RAdGVzdC5ubCIsInRva2VuX3VzYWdlIjoiYWNjZXNzX3Rva2VuIiwianRpIjoiZjI4NDUwNjQtM2M1OC00NzZjLThlYmMtMDgwMjM5MDBkMjUyIiwiYXVkIjoicmVzb3VyY2Vfc2VydmVyIiwibmJmIjoxNTM3NzczMzM3LCJleHAiOjE1Mzc3NzY5MzcsImlhdCI6MTUzNzc3MzMzNywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyJ9.B24zSMUPUEhu0meIguGsMi10ORZGNBX8-i4Lvn1HY5mo6qVT8NhOUu9HYV6vAQJ7mJxagL0vKN6ZbZ7hDTq489lc32lwB_hyucTfBHFn8ewmXxZxdblHJRPlAYzRSfGCOlo3l44uW6uNBz6i6fUYmI2woiwl8k9sitNBfOh_GwTT3XHYyflZUZJpQYIIjWPoLdsQh1Et_634QUcRs4AZZIGX9MZSkejC4qeKhWGUJv0e5CANnO9K_B3ESlD6l53AMV9iE8aATyRv36NIWGVOMqtfsSBbn6iALqSEISyLdLYyXm345kIyTElHEo6CbpXc0a9jcWIzpELLNBL6bwaL7w")
    .build();
 
connection.on("notification", data => {
    console.log(data);
});
 
connection.start()
    .then(() => console.log('started listening')).catch(error => console.log(error));