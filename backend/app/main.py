from fastapi import FastAPI
from agents import run_chatbot

app = FastAPI()

@app.get("/")
def chat():
    return run_chatbot("Hello")

