from scipy.spatial import distance as dist
from imutils import face_utils
import threading
import cv2
import imutils

# define two constants, one for the eye aspect ratio to indicate
# blink and then a second constant for the number of consecutive
# frames the eye must be below the threshold for to sent a notification
EYE_AR_THRESH = 0.2
EYE_AR_CONSEC_FRAMES = 48


def calculate_landmarks():
    (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

    return lStart, lEnd, rStart, rEnd


def eye_aspect_ratio(eye):
    # calculate euclidean distance between the two sets of vertical eye landmarks (x y coordinates)
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])

    # calculate euclidean distance between horizontal eye landmarks
    C = dist.euclidean(eye[0], eye[3])

    # Calculate and return eye aspect ratio (ear)
    return (A + B) / (2.0 * C)


def calculate_ear(shape, lStart, lEnd, rStart, rEnd):
    leftEye = shape[lStart:lEnd]
    rightEye = shape[rStart:rEnd]
    leftEAR = eye_aspect_ratio(leftEye)
    rightEAR = eye_aspect_ratio(rightEye)

    # Calculate average EAR for both eyes
    return (leftEAR + rightEAR) / 2

class FatigueBackgroundWorker:

    def __init__(self, vs, predictor, detector, event, queue):
        self.thread = threading.Thread(target=self.run, args=())
        self.thread.daemon = True
        self.vs = vs
        self.predictor = predictor
        self.detector = detector
        self.event = event
        self.queue = queue
        self.drowsinessDetected = False

    def start(self):
        self.thread.start()

    def check_lock(self):
        if self.event.isSet():
            self.queue.put(self.drowsinessDetected)
            self.drowsinessDetected = False
            self.event.clear()

    def run(self):
        (lStart, lEnd, rStart, rEnd) = calculate_landmarks()

        counter = 0
        while True:
            self.check_lock()
            frame = self.vs.read()
            frame = imutils.resize(frame, width=450)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            faces = self.detector(gray, 0)

            for face in faces:
                shape = self.predictor(gray, face)
                shape = face_utils.shape_to_np(shape)

                ear = calculate_ear(shape, lStart, lEnd, rStart, rEnd)

                if ear < EYE_AR_THRESH:
                    counter += 1

                    # If eyes were closed for a sufficient number of frames, drowsiness is detected
                    if counter >= EYE_AR_CONSEC_FRAMES:
                        self.drowsinessDetected = True
                else:
                    counter = 0
