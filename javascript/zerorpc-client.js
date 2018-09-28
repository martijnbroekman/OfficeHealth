const zerorpc = require("zerorpc");

let client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

module.exports =  {
    start: function start() {
        client.invoke("start", (error) => {
            if (error) throw error;
        });
    },
    start_camera: function start_camera() {
        client.invoke("start_camera", (error, res) => {
            if (error) throw error;
        });
    },
    capture: function capture() {
        return new Promise((resolve, reject) => {
            client.invoke("capture", (error, res) => {
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
