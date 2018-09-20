const zerorpc = require("zerorpc");

let client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

module.exports =  {
    start: function start() {
        return new Promise((resolve, reject) => {
            client.invoke("start", (error, res) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(res);
                }
            })
        });
    },
    settings: function settings() {
        return new Promise((resolve, reject) => {
            client.invoke("settings", (error, res) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(res);
                }
            })
        });
    },
    emotions: function emotions() {
        return new Promise((resolve, reject) => {
            client.invoke("emotions", (error, res) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(res);
                }
            })
        });
    },
    startMeasure: function startMeasure(emitter) {
        setInterval(function () {
            client.invoke("measure", (error, res) => {
                console.log(Date.now())
                if (error) {
                    emitter.emit("error", error);
                } else {
                    emitter.emit("measure_result", res);
                }
            });
        }, 3000); 
    }
}
