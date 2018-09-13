const zerorpc = require("zerorpc");
let client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

const start = () => {
    client.invoke("start", (error, res) => {
        if (error) {
            console.error(error)
        } else {
            console.log(res)
        }
    })
}

