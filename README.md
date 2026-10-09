# NOIR & GOLD — Restaurant Ordering App

A premium dark-and-gold restaurant ordering app built with HTML, CSS and JavaScript.

## Features
- Responsive web app for desktop, tablet and phone
- Installable Progressive Web App (PWA) on supported Android browsers
- Menu categories, menu items and PHP prices
- Add-to-cart and quantity controls
- Automatic subtotal, 10% discount for totals of ₱500 or more, and final total
- Digital receipt with print / Save as PDF
- Basic offline caching after the first successful online load

## Important limits
- This is a front-end demonstration. It does **not** send orders to a restaurant, process payments, or sync carts between devices.
- A QR code that opens the app needs a real, public HTTPS URL. A QR code cannot make a website public by itself.
- For an installable Android PWA, host the site over HTTPS, open the URL in Chrome on Android, then use the browser menu → **Install app** or **Add to Home screen** (wording varies).
- If you specifically need an APK, use the optional Capacitor wrapper instructions below after deploying/testing the web app.

## Run locally
For a quick preview, open `index.html` in a browser. For PWA/service-worker features, serve the folder using a local web server, such as the VS Code Live Server extension.

## Deploy free with GitHub Pages
1. Create a GitHub repository, for example `noir-gold-ordering`.
2. Upload all files and folders from this project to the repository root.
3. In repository **Settings → Pages**, choose deployment from the `main` branch and `/ (root)`.
4. Wait for GitHub Pages to publish the site. The public URL usually resembles `https://YOUR-USERNAME.github.io/noir-gold-ordering/`.
5. Open the URL on your phone and verify the app works.

## Generate the real QR code after deployment
Install Python and run:
```bash
python -m pip install qrcode[pil]
python generate_qr.py https://YOUR-REAL-DEPLOYED-URL/
```
This creates `restaurant-app-qr.png`. Replace the example URL with the actual HTTPS URL from your hosting provider. Do not share the example URL as if it were live.

You can also use any reputable QR generator by pasting the actual deployed HTTPS URL.

## Android APK option (Capacitor)
The `android-wrapper/README.md` explains the optional route for creating a native Android project. Building an APK requires Android Studio / Android SDK and a computer with the required tooling.
