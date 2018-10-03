const axios = require("axios");
const pythonUrl = "http://localhost:5000"

module.exports = {
    start: function start() {
        return new Promise((resolve, reject) => {
            axios.default.get(`${pythonUrl}/start`)
                .then(res => {
                    resolve(res.data)
                })
                .catch(error => reject(error));
        });
    },
    start_camera: function start_camera() {
        return new Promise((resolve, reject) => {
            axios.default.get(`${pythonUrl}/start-camera`)
                .then(res => {
                    resolve(res.data)
                })
                .catch(error => reject(error));
        });
    },
    capture: function capture() {
        return new Promise((resolve, reject) => {
            axios.default.get(`${pythonUrl}/capture`)
                .then(res => {
                    resolve(res.data)
                })
                .catch(error => reject(error));
        });
    },
    startMeasure: function startMeasure() {
        return new Promise((resolve, reject) => {
            axios.default.get(`${pythonUrl}/measure`)
                .then(res => {
                    resolve(res.data)
                })
                .catch(error => reject(error));
        });
    }
}
