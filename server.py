#!/usr/bin/env python3
"""
Servidor Local de Pruebas con Autodetección de IP y QR Code para Celulares
Uso: python3 server.py [puerto]
"""

import http.server
import socketserver
import sys
import socket
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    local_ip = get_local_ip()
    url_local = f"http://localhost:{PORT}"
    url_wifi = f"http://{local_ip}:{PORT}"

    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print("=" * 65)
        print("🚀 SIMULADOR DE CIRCUITOS MECATRÓNICOS - INICIADO")
        print("=" * 65)
        print(f" 💻 Acceso Local (Notebook): {url_local}")
        print(f" 📱 Acceso WiFi (Celulares):  {url_wifi}")
        print("=" * 65)
        print("📌 Para publicar gratis 24/7 en internet (sin depender de tu PC):")
        print("   Sube esta carpeta a GitHub Pages en 2 minutos (Ver README.md)")
        print("=" * 65)
        print("Presiona Ctrl+C para detener el servidor.\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido correctamente.")

if __name__ == "__main__":
    main()
