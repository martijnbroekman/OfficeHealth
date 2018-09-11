const zerorpc = require("zerorpc")
let client = new zerorpc.Client()
client.connect("tcp://127.0.0.1:4242")
 
const helloToPython = (value) => {
    client.invoke("hello", value, (error, res) => {
        if(error) {
        console.error(error)
        } else {
        console.log(res)
        }
    })
}


