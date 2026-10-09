#!/usr/bin/env python3
"""Generate a QR code for the deployed restaurant app URL."""
import argparse
from urllib.parse import urlparse
import qrcode

parser = argparse.ArgumentParser(description="Create a QR code for your deployed restaurant app.")
parser.add_argument("url", help="The real public HTTPS URL of the deployed app")
parser.add_argument("--output", default="restaurant-app-qr.png", help="Output PNG filename")
args = parser.parse_args()

parsed = urlparse(args.url)
if parsed.scheme != "https" or not parsed.netloc or "YOUR-" in parsed.netloc.upper():
    raise SystemExit("Please provide the real public HTTPS URL after deployment, e.g. https://yourname.github.io/noir-gold-ordering/")
img = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=12, border=4)
img.add_data(args.url)
img.make(fit=True)
image = img.make_image(fill_color="#11100e", back_color="#ffffff")
image.save(args.output)
print(f"QR code saved to {args.output}")
print(f"Destination: {args.url}")
