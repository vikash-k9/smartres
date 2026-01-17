from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import uuid
import parser
from models import ResumeData

app = FastAPI(title="Smart Resume Parser API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Resume Parser API is running"}

@app.post("/api/parse", response_model=ResumeData)
async def parse_resume(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{file_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Extract text
        text = parser.extract_text(file_path, file.filename)
        
        # Parse text
        data = parser.parse_resume_text(text)
        
        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Optional: cleanup or keep for "preview"
        pass

class SaveRequest(BaseModel):
    data: ResumeData

@app.post("/api/save")
async def save_profile(req: SaveRequest):
    # Mock save
    print(f"Saving profile for {req.data.name.value}")
    return {"status": "success", "message": "Profile saved successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
