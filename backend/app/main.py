from fastapi import FastAPI
from agents import run_chatbot

app = FastAPI()

@app.get("/")
@limiter.limit("5/day")
def chat():
    return run_chatbot("Hello")

