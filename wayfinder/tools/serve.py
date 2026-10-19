"""Wayfinder dev server: serves the game with caching disabled so edits show up on reload.

Usage: python3 tools/serve.py [port]   (default 5173), then open http://localhost:5173
"""
import http.server
import os
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler)
    print(f"Wayfinder running at http://localhost:{port}")
    server.serve_forever()
