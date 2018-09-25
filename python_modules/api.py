import zerorpc
import sys
from detector import Detector


class SocketRPC(object):

    def __init__(self):
        self.detector = Detector()

    def start(self):
        return self.detector.start()

    def measure(self):
        return self.detector.measure()


def parse_port():
    port = 4242
    try:
        port = int(sys.argv[1])
    except Exception:
        pass
    return '{}'.format(port)


def main():
    # Start socket server
    address = 'tcp://127.0.0.1:' + parse_port()
    s = zerorpc.Server(SocketRPC())
    s.bind(address)
    s.run()


if __name__ == '__main__':
    main()
