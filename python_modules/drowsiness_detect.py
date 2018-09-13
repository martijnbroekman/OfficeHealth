from scipy.spatial import distance as dist
from imutils.video import VideoStream
from imutils import face_utils
import argparse
import imutils
import time
import dlib
import cv2
import sys
import zerorpc


class SocketRPC(object):
    def start(self):
        start_process()


def eye_aspect_ratio(eye):
    # calculate euclidean distance between the two sets of vertical eye landmarks (x y coordinates)
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])

    # calculate euclidean distance between horizontal eye landmarks
    C = dist.euclidean(eye[0], eye[3])

    # Calculate and return eye aspect ratio (ear)
    return (A + B) / (2.0 * C)


def rect_to_bb(rect):
    x = rect.left()
    y = rect.top()
    w = rect.right() - x
    h = rect.bottom() - y

    # return a tuple of (x, y, w, h)
    return (x, y, w, h)


def checkIntersect(rect):
    settingrect = dlib.rectangle(120, 120, 280, 280)

    return rect.tr_corner().x > settingrect.tr_corner().x or rect.tl_corner().x < settingrect.tl_corner().x or \
           rect.br_corner().y > settingrect.br_corner().y or rect.tl_corner().y < settingrect.tl_corner().y


def start_process():
    print("test")
    # parse commannd line arguments. This will be replaced by a settings menu in production
    ap = argparse.ArgumentParser()
    ap.add_argument("-w", "--webcam", type=int, default=0, help="Index of webcam on system")
    args = vars(ap.parse_args())

    # define two constants, one for the eye aspect ratio to indicate
    # blink and then a second constant for the number of consecutive
    # frames the eye must be below the threshold for to sent a notification
    EYE_AR_THRESH = 0.3
    EYE_AR_CONSEC_FRAMES = 48

    # initialize the frame counter
    COUNTER = 0

    print ("[INFO] loading facial landmark predictor")
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

    # grab the indexes of the facial landmarks for the left and
    # right eye, respectively
    (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

    # Start video stream thread
    print("[INFO] starting video stream thread")
    vs = VideoStream(src=args["webcam"]).start()

    # Time for camera to initialize
    time.sleep(1.0)

    # Loop over frames in stream image
    while True:
        # Preprocessing of frame (grayscale and resize
        frame = vs.read()
        frame = imutils.resize(frame, width=450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        rects = detector(gray, 0)

        (a, b, c, d) = rect_to_bb(dlib.rectangle(120, 120, 280, 280))
        # Preset rectangle for posture detection. Will be replaced by settings of user in production
        cv2.rectangle(frame, (a, b), (a + c, b + d), (255, 0, 0), 2)

        # Iterate over faces which have been found
        for rect in rects:
            if checkIntersect(rect):
                cv2.putText(frame, "Wrong posture", (30, 300),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            (x, y, w, h) = rect_to_bb(rect)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Determine facial landmark coordinates for the face region and convert to NumPy array
            shape = predictor(gray, rect)
            shape = face_utils.shape_to_np(shape)

            # Extract both eyes and compute EAR for both eyes
            leftEye = shape[lStart:lEnd]
            rightEye = shape[rStart:rEnd]
            leftEAR = eye_aspect_ratio(leftEye)
            rightEAR = eye_aspect_ratio(rightEye)

            # Calculate average EAR for both eyes (suggested by pros so better probably haha)
            ear = (leftEAR + rightEAR) / 2

            # Drawing convex hull for both eyes (Visualization)
            leftEyeHull = cv2.convexHull(leftEye)
            rightEyeHull = cv2.convexHull(rightEye)
            cv2.drawContours(frame, [leftEyeHull], -1, (0, 255, 0), 1)
            cv2.drawContours(frame, [rightEyeHull], -1, (0, 255, 0), 1)

            # Check if EAR is below blink treshold. If true, increase blink frame counter
            if ear < EYE_AR_THRESH:
                COUNTER += 1

                # If eyes were closed for a sufficient number of frames, drowsiness is detected
                if COUNTER >= EYE_AR_CONSEC_FRAMES:

                    cv2.putText(frame, "Drowsiness detected", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            else:
                COUNTER = 0

            # Draw EAR for debugging
            cv2.putText(frame, "Ear val: {:.2f}".format(ear), (300, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

        # Display the frame
        cv2.imshow("FRAME", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break

    # Cleanup
    cv2.destroyAllWindows()
    vs.stop()


def parse_port():
    port = 4242
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass
    return '{}'.format(port)


def main():
    addr = 'tcp://127.0.0.1:' + parse_port()
    print(addr)
    s = zerorpc.Server(SocketRPC())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()


if __name__ == '__main__':
    main()


