import numpy as np
import cv2


class EMD:

    def __init__(self, predictor, detector):
        self.predictor = predictor
        self.detector = detector

    def rect_to_bb(self, rect):
        x = rect.left()
        y = rect.top()
        w = rect.right() - x
        h = rect.bottom() - y

        # return a np array of (x, y, w, h)
        return np.array([x, y, w, h], np.int32)

    def format_image(self, image, det_faces):

        if not len(det_faces) > 0:
            return None

        # initialize the first face as having maximum area, then find the one with max_area
        area_face = self.rect_to_bb(det_faces[0])
        for det_face in det_faces:
            bb_newface = self.rect_to_bb(det_face)
            if bb_newface[2] * bb_newface[3] > area_face[2] * area_face[3]:
                area_face = bb_newface
        calc_result = area_face

        calc_result[1] -= 30
        calc_result[2] += 50
        calc_result[3] += 50

        # extract ROI of face
        image = image[calc_result[1]:(calc_result[1] + calc_result[2]), calc_result[0]:(calc_result[0] + calc_result[3])]

        try:
            # resize the image so that it can be passed to the neural network
            image = cv2.resize(image, (48, 48), interpolation=cv2.INTER_CUBIC) / 255.
        except Exception:
            print("----->Problem during resize")
            return None

        return image