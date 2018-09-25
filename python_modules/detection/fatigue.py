from scipy.spatial import distance as dist
from imutils import face_utils
import threading
import cv2
import imutils

EYE_AR_THRESH = 0.2
EYE_AR_CONSEC_FRAMES = 48


class FatigueBackgroundWorker:

    def __init__(self, vs, predictor, detector):
        self.thread = threading.Thread(target=self.run, args=())
        self.thread.daemon = True
        self.vs = vs
        self.predictor = predictor
        self.detector = detector
        self.drowsinessDetected = False

    def start(self):
        self.thread.start()

    def get_result(self):
        return self.drowsinessDetected

    def calculate_landmarks(self):
        (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
        (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

        return lStart, lEnd, rStart, rEnd

    def eye_aspect_ratio(self, eye):
        # calculate euclidean distance between the two sets of vertical eye landmarks (x y coordinates)
        A = dist.euclidean(eye[1], eye[5])
        B = dist.euclidean(eye[2], eye[4])

        # calculate euclidean distance between horizontal eye landmarks
        C = dist.euclidean(eye[0], eye[3])

        # Calculate and return eye aspect ratio (ear)
        return (A + B) / (2.0 * C)

    def calculate_ear(self, shape, lStart, lEnd, rStart, rEnd):
        leftEye = shape[lStart:lEnd]
        rightEye = shape[rStart:rEnd]
        leftEAR = self.eye_aspect_ratio(leftEye)
        rightEAR = self.eye_aspect_ratio(rightEye)

        # Calculate average EAR for both eyes
        return (leftEAR + rightEAR) / 2

    def run(self):
        (lStart, lEnd, rStart, rEnd) = self.calculate_landmarks()

        counter = 0
        while True:
            frame = self.vs.read()
            frame = imutils.resize(frame, width=450)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            faces = self.detector(gray, 0)

            for face in faces:
                shape = self.predictor(gray, face)
                shape = face_utils.shape_to_np(shape)

                ear = self.calculate_ear(shape, lStart, lEnd, rStart, rEnd)

                # Check if EAR is lower than treshold value
                if ear < EYE_AR_THRESH:
                    counter += 1

                    # If eyes were closed for a sufficient number of frames, drowsiness is detected
                    if counter >= EYE_AR_CONSEC_FRAMES:
                        self.drowsinessDetected = True
                else:
                    self.drowsinessDetected = False
