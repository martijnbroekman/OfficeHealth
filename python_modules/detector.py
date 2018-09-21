import dlib
import cv2
from imutils.video import VideoStream
import imutils
import time
import json
from pathlib import Path

from detection import fatigue
from detection import posture
from detection.emotion_detection import EMD
from models.Emotion import EMR
from models.Result import Result


class Settings:

    def __init__(self, x, y, w, h):
        self.x = x
        self.y = y
        self.w = w
        self.h = h


class Detector:

    def __init__(self):
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
        self.emd = EMD(self.predictor, self.detector)

        #Initialize network
        self.network = EMR()
        self.network.build_network()

        print("[INFO] starting video stream thread")
        self.vs = VideoStream(0).start()

        # Time for camera to initialize
        time.sleep(1.0)

    def start(self):
        data = {}
        if self.settings_set():
            data["ready"] = True
        else:
            data["ready"] = self.save_settings()

        return json.dumps(data)

    def save_settings(self):
        faceSet = False

        while not faceSet:
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

            if key == ord("s") and len(faces) > 0:
                posture.save_face(faces[0])
                faceSet = True
                cv2.destroyAllWindows()

        return faceSet

    def settings_set(self):
        return Path("settings.json").exists()

    def measure(self):

        # Grab facial landmarks for both eyes
        (lStart, lEnd, rStart, rEnd) = fatigue.calculate_landmarks()

        # Read frame + preprocessing
        frame = self.vs.read()
        frame = imutils.resize(frame, width=450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = self.detector(gray, 0)

        for face in faces:
            posture_core = posture.check_posture(face)

            drowsy_core = fatigue.check_drowsiness(self.predictor(gray, face), lStart, lEnd, rStart, rEnd)

            emotion_score = self.network.predict(self.emd.format_image(gray, faces))

            return json.dumps(Result(self.emd.parse_emotions(emotion_score), posture_core, drowsy_core).__dict__)


