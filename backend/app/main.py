from fastapi import FastAPI
from app.agents import run_chatbot
from app.limiter import limiter

app = FastAPI()

@app.get("/")
@limiter.limit("5/day")
def chat():
    return run_chatbot("Hello")

@app.get("/chat")
@limiter.limit("5/day")
def chat(question:str):
    return run_chatbot(question)

@app.get("/plan")
@limiter.limit("5/day")
def chat(question:str):
    return run_chatbot(question)