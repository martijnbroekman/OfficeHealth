import cv2
from em_model import EMR
import numpy as np
import dlib

EMOTIONS = ['angry', 'disgusted', 'fearful', 'happy', 'sad', 'surprised', 'neutral']

def rect_to_bb(rect):
    x = rect.left()
    y = rect.top()
    w = rect.right() - x
    h = rect.bottom() - y

    # return a tuple of (x, y, w, h)
    return np.array([x, y, w, h], np.int32)


def format_image(image):
    """
    Function to format frame
    """
    if len(image.shape) > 2 and image.shape[2] == 3:
        # determine whether the image is color
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        # Image read from buffer
        image = cv2.imdecode(image, cv2.CV_LOAD_IMAGE_GRAYSCALE)

    det_faces = detector(gray, 0)

    if not len(det_faces) > 0:
        return None

    # initialize the first face as having maximum area, then find the one with max_area
    area_face = rect_to_bb(det_faces[0])
    for det_face in det_faces:
        bb_newface = rect_to_bb(det_face)
        if bb_newface[2] * bb_newface[3] > area_face[2] * area_face[3]:
            area_face = newface
    calc_result = area_face

    calc_result[1] -= 30
    calc_result[2] += 50
    calc_result[3] += 50
    print("0: {}, 1: {}, 2:{}, 3:{}".format(calc_result[0], calc_result[1], calc_result[2], calc_result[3]))


    # extract ROI of face
    image = image[calc_result[1]:(calc_result[1] + calc_result[2]), calc_result[0]:(calc_result[0] + calc_result[3])]

    try:
        # resize the image so that it can be passed to the neural network
        image = cv2.resize(image, (48, 48), interpolation=cv2.INTER_CUBIC) / 255.
    except Exception:
        print("----->Problem during resize")
        return None

    return image


# Initialize object of EMR class
network = EMR()
network.build_network()

cap = cv2.VideoCapture(0)
font = cv2.FONT_HERSHEY_SIMPLEX
feelings_faces = []

print("[INFO] loading facial landmark predictor")
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

# append the list with the emoji images
for index, emotion in enumerate(EMOTIONS):
    feelings_faces.append(cv2.imread('./emojis/' + emotion + '.png', -1))

while True:
    # Again find haar cascade to draw bounding box around face
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = detector(gray, 0)

    # compute softmax probabilities
    result = network.predict(format_image(frame))
    if result is not None:
        # write the different emotions and have a bar to indicate probabilities for each class
        for index, emotion in enumerate(EMOTIONS):
            cv2.putText(frame, emotion, (10, index * 20 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1);
            cv2.rectangle(frame, (130, index * 20 + 10), (130 + int(result[0][index] * 100), (index + 1) * 20 + 4),
                          (255, 0, 0), -1)

        # find the emotion with maximum probability and display it
        maxindex = np.argmax(result[0])
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, EMOTIONS[maxindex], (10, 360), font, 2, (255, 255, 255), 2, cv2.LINE_AA)
        face_image = feelings_faces[maxindex]

        for c in range(0, 3):
            # the shape of face_image is (x,y,4)
            # the fourth channel is 0 or 1
            # in most cases it is 0, so, we assign the roi to the emoji
            # you could also do:
            # frame[200:320,10:130,c] = frame[200:320, 10:130, c] * (1.0 - face_image[:, :, 3] / 255.0)
            frame[200:320, 10:130, c] = face_image[:, :, c] * (face_image[:, :, 3] / 255.0) + frame[200:320, 10:130,
                                                                                              c] * (
                                                    1.0 - face_image[:, :, 3] / 255.0)

    if not len(faces) > 0:
        # do nothing if no face is detected
        a = 1
    else:
        # draw box around face with maximum area
        max_area_face = rect_to_bb(faces[0])
        for face in faces:
            newface = rect_to_bb(face)
            if newface[2] * newface[3] > max_area_face[2] * max_area_face[3]:
                max_area_face = newface
        face = max_area_face

        face[0] -= 50
        face[1] -= 50
        face[2] += 100
        face[3] += 100

        (x, y, w, h) = max_area_face
        frame = cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

    cv2.imshow('Video', cv2.resize(frame, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC))
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
