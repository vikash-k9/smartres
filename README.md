# Smart Resume Parser

A full-stack application that parses resumes (PDF, DOCX, TXT) into structured data with confidence scoring, featuring a premium glassmorphism UI.

## Quick Start (Clean Setup)

If you are having trouble running the app, follow these steps to use clean ports:

1.  **Backend (Run in terminal 1):**
    ```powershell
    cd backend
    uvicorn main:app --reload --port 8002
    ```
    *Runs on http://localhost:8002*

2.  **Frontend (Run in terminal 2):**
    ```powershell
    cd frontend
    npx vite --port 3000
    ```
    *Runs on http://localhost:3000*

## Features

- **Smart Parsing**: Extracts Contact Info, Skills, Experience, and Education using intelligent regex and heuristics.
- **Confidence Scoring**: Flags low-confidence extractions (<70%) with visual amber warnings.
- **Interactive Editor**: Review and correct parsed data side-by-side with the original resume.
- **Export**: Save your verified profile as a JSON file.
- **Premium UI**: Modern, responsive interface with Glassmorphism design.

## Tech Stack

- **Backend**: FastAPI, Uvicorn, PyPDF, python-docx
- **Frontend**: React, Vite, Lucide-React
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism)
