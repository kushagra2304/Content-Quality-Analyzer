# backend/app.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import re
import json

from langchain_google_genai import GoogleGenerativeAI, ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

# Load Gemini API key from env
# e.g. export GOOGLE_API_KEY="your_key"
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("You must set GOOGLE_API_KEY environment variable")

# Initialize LLM
# Choose a suitable Gemini model (e.g. gemini-2.5-pro, gemini-2.5-flash, etc.)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro")

class ContentRequest(BaseModel):
    content: str

class Analysis(BaseModel):
    readability: int
    seo: int
    grammar: int
    tone: str
    overall: str
    suggestion: str

@app.post("/analyze", response_model=Analysis)
async def analyze(req: ContentRequest):
    content = req.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Content is empty")
    
    prompt = f"""
You are a content quality expert. Analyze the following content, and return ONLY a valid JSON object with:

- readability: an integer from 0 to 100
- seo: an integer 0 to 100
- grammar: an integer 0 to 100
- tone: one word (e.g. Formal, Casual, Persuasive, Neutral, Humorous)
- overall: one of Excellent / Good / Average / Poor
- suggestion: one or two sentences of advice to improve the content

Here is the content:
\"\"\"{content}\"\"\"
"""

    resp = llm.invoke(prompt)

    raw_text = resp.content.strip()

    # 🔥 Remove Markdown code fences if they exist
    cleaned = re.sub(r"^```(?:json)?|```$", "", raw_text, flags=re.MULTILINE).strip()

    try:
        result = json.loads(cleaned)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse response: {e}; raw: {raw_text}"
        )
    
    return Analysis(
        readability=int(result.get("readability", 0)),
        seo=int(result.get("seo", 0)),
        grammar=int(result.get("grammar", 0)),
        tone=str(result.get("tone", "")),
        overall=str(result.get("overall", "")),
        suggestion=str(result.get("suggestion", ""))
    )