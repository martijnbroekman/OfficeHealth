import zerorpc

c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4243")


def send_posture(posture):
    return c.posture(posture)


def send_emotions(emotions):
    return c.emotions(emotions)


def send_drowsiness(drowsiness):
    return c.drowsiness(drowsiness)


def send_stress(stress):
    return c.stress(stress)
