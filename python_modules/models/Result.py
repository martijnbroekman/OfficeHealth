class Result:

    def __init__(self, face_detected, emotions = None, posture = None, fatigue = None):
        self.face_detected = face_detected
        self.emotions = emotions
        self.posture = posture
        self.fatigue = fatigue
