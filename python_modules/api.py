import zerorpc
import client
import sys
from detector import Detector


class SocketRPC(object):
    def start(self):
        detector.start()
        return "Started successfully"

    def settings(self):
        return "settings"

    def emotion(self):
        return "emotion"

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
    detector = Detector()
    main()
