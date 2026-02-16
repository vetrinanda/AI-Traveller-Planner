from langgraph.graph import Graph,StateGraph,END
from langchain_core.templates import ChatPromptTemplate
from langchain_core.messages import HumanMessage,SystemMessage
from langchain_openai import ChatOpenAI
from typing import TypedDict,Annotated
from operator import add

class State(TypedDict):
    messages:Annotated[list,add]

llm = ChatOpenAI(model="gpt-4o-mini",temperature=0)

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
