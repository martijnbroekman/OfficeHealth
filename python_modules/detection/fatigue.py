from scipy.spatial import distance as dist
from imutils import face_utils

# define two constants, one for the eye aspect ratio to indicate
# blink and then a second constant for the number of consecutive
# frames the eye must be below the threshold for to sent a notification
EYE_AR_THRESH = 0.2


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


def check_drowsiness(shape, lStart, lEnd, rStart, rEnd):
    shape = face_utils.shape_to_np(shape)

    leftEye = shape[lStart:lEnd]
    rightEye = shape[rStart:rEnd]
    leftEAR = eye_aspect_ratio(leftEye)
    rightEAR = eye_aspect_ratio(rightEye)

    # Calculate average EAR for both eyes
    ear =  (leftEAR + rightEAR) / 2

    # Check if EAR is < ear treshold
    return bool(ear < EYE_AR_THRESH)
