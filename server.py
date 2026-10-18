"""Server lokal untuk melihat website di laptop/HP (satu jaringan WiFi).
Jalankan:  python server.py
Buka di browser: http://localhost:8000  (di HP: http://IP-LAPTOP:8000)
"""
import http.server, socketserver, os

PORT = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))
with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as s:
    print(f"Website berjalan di http://localhost:{PORT} (Ctrl+C untuk berhenti)")
    s.serve_forever()
