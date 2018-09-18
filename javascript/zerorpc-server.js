const zerorpc = require("zerorpc");

let server;

module.exports = {
    start: function startServer(postureCallback, emotionsCallback, drowsinessCallback, stressCallback) {
        if (server !== undefined && !server.closed()) {
            server.close();
        }

        server = new zerorpc.Server({
            posture: function(posture, reply) {
                reply(null, "ok");
                if (typeof postureCallback === "function") { 
                    postureCallback(posture);
                }
            },
            emotions: function(emotion, reply) {
                reply(null, "ok");

                if (typeof emotionsCallback === "function") { 
                    emotionsCallback(emotion);
                }
            },
            drowsiness: function(drowsiness, reply) {
                reply(null, "ok");

                if (typeof drowsinessCallback === "function") { 
                    drowsinessCallback(drowsiness);
                }
            },
            stress: function(stress, reply) {
                reply(null, "ok");

                if (typeof stressCallback === "function") {
                    stressCallback(stress);
                }
            }
        });


        server.bind("tcp://0.0.0.0:4243");
    }
}

