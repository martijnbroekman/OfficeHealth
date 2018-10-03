import json
from detector import Detector
from flask import Flask

class Resultresponse:

    def __init__(self, result):
        self.result = result

app = Flask("App")
detector = Detector()

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/start')
def start():
    return json.dumps(Resultresponse(detector.start()).__dict__)


@app.route('/measure')
def measure():
    return detector.measure()


@app.route('/start-camera')
def start_camera():
    return json.dumps(Resultresponse(detector.start_camera()).__dict__)


@app.route('/capture')
def capture():
    return json.dumps(Resultresponse(detector.capture()).__dict__)


if __name__ == "__main__":
    app.run()
