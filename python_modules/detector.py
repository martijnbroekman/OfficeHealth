import dlib
import cv2
from imutils.video import VideoStream
import imutils
import time
import json
from collections import namedtuple
from enum import Enum

DIVIDER = 15


class PostureScore(Enum):
    GOOD = 1
    FINE = 2
    BAD = 3


class Settings:

    def __init__(self, x, y, w, h):
        self.x = x
        self.y = y
        self.w = w
        self.h = h


def rect_to_bb(rect):
    x = rect.left()
    y = rect.top()
    w = rect.right() - x
    h = rect.bottom() - y

    # return a tuple of (x, y, w, h)
    return x, y, w, h


def check_intersect(rect):
    settingsfile = open("settings.json")
    settings = json.loads(settingsfile.read(), object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
    score = PostureScore.GOOD

    topScore = round((rect.tl_corner().y - settings.y) * -1 / DIVIDER)
    bottomScore = round((rect.bl_corner().y - (settings.y + settings.h)) / DIVIDER)
    leftScore = round((rect.tl_corner().x - settings.x) * -1 / DIVIDER)
    rightScore = round((rect.tr_corner().x - (settings.x + settings.h)) / DIVIDER)

    if topScore >= 3 or bottomScore >= 3 or leftScore >= 3 or rightScore > 3:
        score = PostureScore.BAD
    elif topScore == 2 or bottomScore == 2 or leftScore == 2 or rightScore == 2:
        score = PostureScore.FINE

    print("Score: {}".format(score))


def save_face(faceFound):
    (xf, yf, wf, hf) = rect_to_bb(faceFound)
    settings = Settings(xf, yf, wf, hf)

    with open("settings.json", "w") as out:
        json.dump(settings.__dict__, out)

def load_settings():
    settingsfile = open("settings.json")
    return json.loads(settingsfile.read(), object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))

class Detector:

    def __init__(self):
        self.detector = dlib.get_frontal_face_detector()
        print("[INFO] starting video stream thread")
        self.vs = VideoStream(0).start()

        # Time for camera to initialize
        time.sleep(1.0)

    def measure(self):
        # Read frame + preprocessing
        frame = self.vs.read()
        frame = imutils.resize(frame, width=450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = self.detector(gray, 0)

        for face in faces:
            check_intersect(face)


