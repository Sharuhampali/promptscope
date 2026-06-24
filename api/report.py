from http.server import BaseHTTPRequestHandler
import io
import os
import sys

# Add project root to sys.path to allow importing report.py
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

try:
    from report import build_pdf
except ImportError:
    # Fallback if imported from parent directory context
    sys.path.append(os.getcwd())
    from report import build_pdf

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Create a BytesIO buffer to build the PDF in memory
            pdf_buffer = io.BytesIO()
            
            # Call build_pdf with the buffer
            build_pdf(pdf_buffer, {})
            
            # Retrieve PDF binary content
            pdf_data = pdf_buffer.getvalue()
            pdf_buffer.close()
            
            # Send HTTP response headers
            self.send_response(200)
            self.send_header('Content-Type', 'application/pdf')
            self.send_header('Content-Disposition', 'attachment; filename="PromptScope_Security_Report.pdf"')
            self.send_header('Content-Length', str(len(pdf_data)))
            
            # CORS headers
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Stream the PDF file back
            self.wfile.write(pdf_data)
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            error_message = f"Error generating PromptScope PDF report: {str(e)}"
            self.wfile.write(error_message.encode('utf-8'))

    def do_POST(self):
        # Reuse GET logic for POST
        self.do_GET()

    def do_OPTIONS(self):
        # Handle preflight CORS request
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
