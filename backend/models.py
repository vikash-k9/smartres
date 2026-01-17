from typing import List, Optional
from pydantic import BaseModel

class ConfidentValue(BaseModel):
    value: str
    confidence: float
    message: Optional[str] = None

class Experience(BaseModel):
    title: ConfidentValue
    company: ConfidentValue
    duration: ConfidentValue
    description: ConfidentValue

class Education(BaseModel):
    degree: ConfidentValue
    institution: ConfidentValue
    year: ConfidentValue
    result: Optional[ConfidentValue] = None

class ResumeData(BaseModel):
    name: ConfidentValue
    email: ConfidentValue
    phone: ConfidentValue
    skills: List[ConfidentValue]
    experience: List[Experience]
    education: List[Education]
    projects: List[str]  # Simplified for now
    overall_confidence: float
