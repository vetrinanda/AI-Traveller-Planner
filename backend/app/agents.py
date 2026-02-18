from langgraph.graph import StateGraph,END
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import TypedDict,Annotated
from operator import add
from dotenv import load_dotenv
import os

load_dotenv()

class State(TypedDict):
    messages:Annotated[list,add]

llm = ChatGoogleGenerativeAI(api_key=os.getenv("GOOGLE_API_KEY"),model="gemini-2.5-flash",temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system","You are a helpful assistant."),
    ("user"," {question}")
])

chain = prompt | llm

def chatbot(state:State):
    return {"messages":[chain.invoke(state["messages"])]}

graph_builder = StateGraph(State)
graph_builder.add_node("chatbot",chatbot)
graph_builder.add_edge("chatbot",END)
graph_builder.set_entry_point("chatbot")

graph = graph_builder.compile()

def run_chatbot(question:str):
    return graph.invoke({"messages":[HumanMessage(content=question)]})
