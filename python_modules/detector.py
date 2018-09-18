from models.Emotion import EMR
import cv2
import numpy as np
import dlib
import time
import imutils
import client
import threading

from detection import fatigue
from detection import posture
from detection.emotion_detection import EMD

EMOTIONS = ['angry', 'disgusted', 'fearful', 'happy', 'sad', 'surprised', 'neutral']

# define two constants, one for the eye aspect ratio to indicate
# blink and then a second constant for the number of consecutive
# frames the eye must be below the threshold for to sent a notification
EYE_AR_THRESH = 0.3
EYE_AR_CONSEC_FRAMES = 48

class Detector:

    def __init__(self):
        print("[INFO] loading facial landmark predictor")

        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
        self.emd = EMD(self.predictor, self.detector)

        #Initialize network
        self.network = EMR()
        self.network.build_network()

        #Initialize camera
        self.cap = cv2.VideoCapture(0)

        # Init camera time
        time.sleep(1.0)


    def rect_to_bb(self, rect):
        x = rect.left()
        y = rect.top()
        w = rect.right() - x
        h = rect.bottom() - y

        # return a tuple of (x, y, w, h)
        return x, y, w, h

    def start(self):
        print("[INFO] loading facial landmark predictor")
        detector = dlib.get_frontal_face_detector()
        predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
        self.emd = EMD(predictor, detector)

        self.start_reading()

    def stop(self):
        self.cap.release()

    def start_reading(self):
        # grab the indexes of the facial landmarks for the left and
        # right eye, respectively
        (lStart, lEnd, rStart, rEnd) = fatigue.calculate_landmarks()

        COUNTER = 0


        # Again find haar cascade to draw bounding box around face
        ret, frame = self.cap.read()

        frame = imutils.resize(frame, width=450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        rects = self.detector(gray, 0)

        for rect in rects:
            if posture.check_posture(rect):
                # TODO return bad posture
            #     cv2.putText(frame, "Wrong posture", (30, 300),
            #                 cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            #
            # (x, y, w, h) = self.rect_to_bb(rect)

            # Draw face region for debugging
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            ear = fatigue.calculate_ear(self.predictor(gray, rect), lStart, lEnd, rStart, rEnd)
            print("Ear: {}".format(ear))

            # Check if EAR is below blink treshold. If true, increase blink frame counter
            if ear < EYE_AR_THRESH:
                COUNTER += 1

                # If eyes were closed for a sufficient number of frames, drowsiness is detected
                if COUNTER >= EYE_AR_CONSEC_FRAMES:
                    # TODO return drowsiness detected. On hold for now
                    # cv2.putText(frame, "Drowsiness detected", (10, 30),
                    #             cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            else:
                COUNTER = 0

            # Draw EAR for debugging
            # cv2.putText(frame, "Ear val: {:.2f}".format(ear), (300, 30),
            #             cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

        # compute softmax probabilities
        result = self.network.predict(self.emd.format_image(gray, rects))
        if result is not None:
            print("Emotion result: {}".format(result))
            # Draw emotions for debugging
            # TODO send data to electron app
            # for index, emotion in enumerate(EMOTIONS):
            #     cv2.putText(frame, emotion, (10, index * 20 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1);
            #     cv2.rectangle(frame, (130, index * 20 + 10), (130 + int(result[0][index] * 100), (index + 1) * 20 + 4),
            #                   (255, 0, 0), -1)

            # find the emotion with maximum probability and display it
            maxindex = np.argmax(result[0])
            # font = cv2.FONT_HERSHEY_SIMPLEX
            # cv2.putText(frame, EMOTIONS[maxindex], (10, 360), font, 2, (255, 255, 255), 2, cv2.LINE_AA)

        # cv2.imshow('Video', cv2.resize(frame, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC))
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break
        # cv2.destroyAllWindows()

        print ("Executed")
        threading.Timer(10, self.start_reading).start()


if __name__ == '__main__':
    det = Detector()
    det.start()
