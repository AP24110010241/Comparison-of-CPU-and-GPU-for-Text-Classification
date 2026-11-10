# COA Backend – IMDb CPU vs GPU Text Classification

Real backend connected to your IMDb notebook.

## What it does
- Loads / trains TF-IDF + Logistic Regression on IMDb reviews
- Measures real CPU inference time
- Estimates GPU time using the speedup from your notebook (~3x)
- Serves your frontend and `/api/classify`

## Setup
```bash
cd coa_backend
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000

First run trains models from `IMDB Dataset.zip` (may take 1–2 minutes), then saves them in `models/`.
