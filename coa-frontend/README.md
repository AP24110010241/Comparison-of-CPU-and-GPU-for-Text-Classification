# Architectural Performance Comparison of CPU and GPU for Text Classification

**Computer Organization and Architecture (COA) Project – Frontend**

This is a complete, working static website (HTML + CSS + JavaScript).  
All performance numbers and classification results are **demonstration data only**. They are **not** real experimental benchmark measurements.

---

## How to Open / Run the Website

### Method 1 – Easiest (recommended)

1. Extract this ZIP file.
2. Open the folder `coa-frontend`.
3. **Double-click the file `index.html`**.
4. The website will open in your default browser (Chrome, Edge, Firefox, etc.).

That is all you need. No installation, no server, no internet required for the main UI (Chart.js is loaded from a CDN, so a brief internet connection is needed the first time for the charts).

### Method 2 – Using a local server (optional)

If you prefer to run a small local server:

```bash
cd coa-frontend
python -m http.server 8000
```

Then open your browser and go to:  
http://localhost:8000

---

## Project Structure

```
coa-frontend/
├── index.html      ← Main website (open this file)
├── style.css       ← All styling
├── script.js       ← Classification logic + charts
└── README.md       ← This file
```

All three files (`index.html`, `style.css`, `script.js`) must stay in the **same folder**.

---

## Features

- Modern responsive home page with project title
- Navigation (Home / Classify / Dashboard / About)
- Text classification interface with three buttons:
  - Run on CPU
  - Run on GPU
  - Compare Both
- Performance cards showing Inference Time, Throughput, Memory Usage
- Interactive Chart.js bar charts (CPU vs GPU)
- Summary table
- Clear **DEMO** labels everywhere so demonstration data is never mistaken for real results

---

## Important Note about Data

Every number you see (48 ms, 9 ms, 21 samples/s, 112 samples/s, 320 MB, 780 MB, confidence percentages, etc.) is **fixed demonstration / mock data** created only so the frontend looks complete and works.

These values are **not** actual experimental results from running a trained model on real CPU/GPU hardware.

When a real machine-learning backend is ready, the mock functions inside `script.js` can be replaced with real API calls.

---

## Requirements

- Any modern web browser (Chrome, Edge, Firefox, Safari)
- Internet connection only needed once to load Chart.js from CDN

No Node.js, no Python packages, no extra tools required for normal use.
