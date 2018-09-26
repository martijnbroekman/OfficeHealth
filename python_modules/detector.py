import dlib
import cv2
from imutils.video import VideoStream
import imutils
import time
import json
from pathlib import Path
import gevent

from detection.fatigue import FatigueBackgroundWorker
from detection import posture
from detection import emotion_detection as emd
from models.Result import Result


class Settings:

    def __init__(self, x, y, w, h):
        self.x = x
        self.y = y
        self.w = w
        self.h = h


class Detector:

    def __init__(self):
        # setup dlib and load model for face detection
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
        self.vs = VideoStream(0).start()

        # Initialize background worker for detecting drowsiness
        self.background_worker = FatigueBackgroundWorker(self.vs, self.predictor, self.detector)

        # Time for camera to initialize
        time.sleep(1.0)

    def start(self):
        data = {}

        # Check if settings are set, if not load setup screen
        if self.settings_set():
            data["ready"] = True
        else:
            data["ready"] = self.save_settings()

        # Start background worker
        self.background_worker.start()

        return json.dumps(data)

    def save_settings(self):
        faceSet = False

        while not faceSet:
            gevent.sleep(0)
            frame = self.vs.read()

            frame = imutils.resize(frame, width=450)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Detect faces
            faces = self.detector(gray, 0)

            for face in faces:
                (x, y, w, h) = posture.rect_to_bb(face)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            cv2.imshow("Posture", frame)
            key = cv2.waitKey(1) & 0xFF

            # Save settings on s click
            if key == ord("s") and len(faces) > 0:
                posture.save_face(faces[0])
                faceSet = True
                cv2.destroyAllWindows()

        return faceSet

    def settings_set(self):
        return Path("settings.json").exists()

    def measure(self):
        frame = self.vs.read()
        frame = imutils.resize(frame, width=450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = self.detector(gray, 0)

        for face in faces:
            cv2.imwrite('live.png', frame)

            # Calculate posture score
            posture_score = posture.check_posture(face)

            # Get drowsiness score
            drowsy_score = self.background_worker.get_result()

            # Calculate emotion score
            emotion_score = emd.predict_emotions()

            return json.dumps(Result(True, emotion_score, posture_score, drowsy_score).__dict__)

        # When no face is detected, return false
        return json.dumps(Result(False).__dict__)


