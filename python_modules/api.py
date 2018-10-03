import zerorpc
import sys
from detector import Detector
from flask import Flask

app = Flask("App")
detector = Detector()

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/start')
def start():
    return detector.start()


@app.route('/measure')
def measure():
    return detector.measure()


@app.route('/start-camera')
def start_camera():
    detector.start_camera()


@app.route('/capture')
def capture():
    detector.capture()


if __name__ == "__main__":
    app.run()
