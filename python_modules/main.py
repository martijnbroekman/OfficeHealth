from models.Emotion import EMR
import cv2
import numpy as np
import dlib
from detection.emotion_detection import EMD

EMOTIONS = ['angry', 'disgusted', 'fearful', 'happy', 'sad', 'surprised', 'neutral']


def start():
    # Initialize object of EMR class
    network = EMR()
    network.build_network()

    cap = cv2.VideoCapture(0)

    while True:
        # Again find haar cascade to draw bounding box around face
        ret, frame = cap.read()

        # compute softmax probabilities
        result = network.predict(emd.format_image(frame))
        if result is not None:

            # Draw emotions for debugging
            #TODO send data to electron app
            for index, emotion in enumerate(EMOTIONS):
                cv2.putText(frame, emotion, (10, index * 20 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1);
                cv2.rectangle(frame, (130, index * 20 + 10), (130 + int(result[0][index] * 100), (index + 1) * 20 + 4),
                              (255, 0, 0), -1)

            # find the emotion with maximum probability and display it
            maxindex = np.argmax(result[0])
            font = cv2.FONT_HERSHEY_SIMPLEX
            cv2.putText(frame, EMOTIONS[maxindex], (10, 360), font, 2, (255, 255, 255), 2, cv2.LINE_AA)

        cv2.imshow('Video', cv2.resize(frame, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC))
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    print("[INFO] loading facial landmark predictor")
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
    emd = EMD(predictor, detector)
    start()