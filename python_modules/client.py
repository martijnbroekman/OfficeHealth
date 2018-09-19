import zerorpc


class Client:

    def __init__(self):
        self.c = zerorpc.Client()
        self.c.connect("tcp://127.0.0.1:4243")

    def send_posture(self, posture):
        return self.c.posture(posture)

    def send_emotions(self, emotions):
        return self.c.emotions(emotions)

    def send_drowsiness(self, drowsiness):
        return self.c.drowsiness(drowsiness)

    def send_stress(self, stress):
        return self.c.stress(stress)
