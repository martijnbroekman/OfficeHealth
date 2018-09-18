import zerorpc
import client
import sys

class SocketRPC(object):
    def start(self):
        return client.send_drowsiness("test")

    def settings(self):
        return "ok"

    def emotion(self):
        return "ok"

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
