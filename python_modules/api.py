from __future__ import print_function
import sys
import zerorpc

class HelloRPC(object):
    def hello(self, name):
        return "hello, %s" % name

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
    s = zerorpc.Server(HelloRPC())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()