from detector import Detector
from flask import Flask, Response

class Resultresponse:

    def __init__(self, result):
        self.result = result


app = Flask("App")
detector = Detector()


@app.route('/measure')
def measure():
    return Response(detector.measure(), status=200, mimetype='application/json')


@app.route('/start-camera')
def start_camera():
    detector.start_camera()
    return Response(status=200)


@app.route('/capture')
def capture():
    detector.capture()
    return Response(status=200)


if __name__ == "__main__":
    app.run()
