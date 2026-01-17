import re
from typing import List, Dict
from pypdf import PdfReader
import docx
from models import ResumeData, ConfidentValue, Experience, Education

def extract_text(file_path: str, filename: str) -> str:
    text = ""
    try:
        if filename.lower().endswith('.pdf'):
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        elif filename.lower().endswith('.docx'):
            doc = docx.Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        else:
            # Fallback for txt
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
    except Exception as e:
        print(f"Error extracting text: {e}")
    return text

def parse_resume_text(text: str) -> ResumeData:
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Defaults
    name = ConfidentValue(value="Unknown", confidence=0.0)
    email = ConfidentValue(value="", confidence=0.0)
    phone = ConfidentValue(value="", confidence=0.0)
    skills: List[ConfidentValue] = []
    edu_list: List[Education] = []
    exp_list: List[Experience] = []
    
    # 1. Extraction: Email
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    email_match = re.search(email_pattern, text)
    if email_match:
        email = ConfidentValue(value=email_match.group(0), confidence=95.0)
    
    # 2. Extraction: Phone
    # Simple pattern for demo
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phone_match = re.search(phone_pattern, text)
    if phone_match:
        phone = ConfidentValue(value=phone_match.group(0), confidence=90.0)

    # 3. Extraction: Name (Heuristic: First non-empty line usually)
    # Improve finding name by checking if it's not a label like "Resume"
    if lines:
        possible_name = lines[0]
        # Basic check: title case, max 3 words
        if len(possible_name.split()) <= 4 and not "resume" in possible_name.lower():
             name = ConfidentValue(value=possible_name, confidence=80.0)

    # 4. Section Detection and Logic
    # Simple keyword based sectioning
    current_section = None
    skill_keywords = ["python", "java", "react", "fastapi", "docker", "sql", "javascript", "html", "css", "node", "aws", "git"]
    
    # Simple state machine for parsing
    # This is a MOCK parser, so we will use simple heuristics
    
    # Skills extraction (Global search for simplicity in this mock)
    found_skills = []
    for word in text.split():
        clean_word = word.strip(" ,.()").lower()
        if clean_word in [s.lower() for s in skill_keywords]:
            # dedupe
            if clean_word not in [s.lower() for s in found_skills]:
                found_skills.append(clean_word)
    
    # Map back to title case
    for s in found_skills:
        # crude capitalization
        skills.append(ConfidentValue(value=s.title(), confidence=85.0))

    # Mock Education/Experience extraction
    # In a real app we'd split text by headers like "EDUCATION", "EXPERIENCE"
    headings = {
        "EDUCATION": ["education", "academic", "qualifications"],
        "EXPERIENCE": ["experience", "employment", "work history", "work experience"],
        "SKILLS": ["skills", "technical skills", "competencies"]
    }
    
    sections = {}
    current_head = "Uncategorized"
    sections[current_head] = []
    
    for line in lines:
        is_heading = False
        upper_line = line.upper()
        for head, keywords in headings.items():
            if upper_line in [k.upper() for k in keywords] or any(k.upper() in upper_line and len(line) < 30 for k in keywords):
                current_head = head
                sections[current_head] = []
                is_heading = True
                break
        
        if not is_heading:
            if current_head not in sections: sections[current_head] = []
            sections[current_head].append(line)

    # Process Education
    if "EDUCATION" in sections:
        # Very naive line parser for demo
        # Assuming format: Degree, Uni, Year
        content = sections["EDUCATION"]
        if content:
            # Taking the first line as degree/uni combination
            deg_line = content[0]
            edu_list.append(Education(
                degree=ConfidentValue(value=deg_line, confidence=75.0),
                institution=ConfidentValue(value="Inferred from text", confidence=60.0), # Low confidence demo
                year=ConfidentValue(value="202X", confidence=50.0)
            ))

    # Process Experience
    if "EXPERIENCE" in sections:
        content = sections["EXPERIENCE"]
        if content:
            # First line as Role/Company
            role_line = content[0]
            exp_list.append(Experience(
                title=ConfidentValue(value=role_line, confidence=70.0),
                company=ConfidentValue(value="Inferred Corp", confidence=65.0),
                duration=ConfidentValue(value="Jan 2023 - Present", confidence=60.0),
                description=ConfidentValue(value=" ".join(content[1:3]), confidence=80.0)
            ))

    if not exp_list:
        # Mock data if nothing found just to show the UI
        pass

    return ResumeData(
        name=name,
        email=email,
        phone=phone,
        skills=skills,
        experience=exp_list,
        education=edu_list,
        projects=[],
        overall_confidence=80.0
    )
