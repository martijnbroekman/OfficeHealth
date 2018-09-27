const zerorpc = require("zerorpc");

let client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

module.exports =  {
    start: function start() {
        client.invoke("start", (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    },
    start_camera: function start_camera() {
        return new Promise((resolve, reject) => {
            client.invoke("start_camera", (error, res) => {
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
        client.invoke("measure", (error, res) => {
            if (error) {
                emitter.emit("error", error);
            } else {
                emitter.emit("measure_result", res);
            }
        });
    }
}
