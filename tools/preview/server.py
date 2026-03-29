import argparse
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8130)
    parser.add_argument("--root", default=os.getcwd())
    args = parser.parse_args()

    root = os.path.abspath(args.root)
    server = ThreadingHTTPServer(("127.0.0.1", args.port), partial(QuietHandler, directory=root))

    try:
        server.serve_forever()
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
