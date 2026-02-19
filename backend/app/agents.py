from langgraph.graph import StateGraph, END
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import TypedDict, Annotated, List
from dotenv import load_dotenv
import os

load_dotenv()

# ── State ──────────────────────────────────────────────────────────────────────
class PlannerState(TypedDict):
    messages: Annotated[List[HumanMessage | AIMessage], "The messages in the conversation"]
    city: str
    interests: List[str]
    itinerary: str

# ── LLM ────────────────────────────────────────────────────────────────────────
llm = ChatGoogleGenerativeAI(
    api_key=os.getenv("GOOGLE_API_KEY"),
    model="gemini-3-flash-preview",
    temperature=0
)

# ── Prompt ─────────────────────────────────────────────────────────────────────
itinerary_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an excellent and professional travel assistant. "
        "Create a detailed day trip itinerary for {city} based on the user's interests: {interests}. "
        "Provide a well-structured, bulleted itinerary with timings."
    ),
    ("human", "Create an itinerary for my day trip.")
])

# ── Helpers ────────────────────────────────────────────────────────────────────
def _extract_text(content) -> str:
    """Safely extract a plain string from an LLM response content field.
    Gemini may return a list of content blocks: [{'type': 'text', 'text': '...'}]
    or a plain string depending on the API version.
    """
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
            elif isinstance(block, str):
                parts.append(block)
        return "".join(parts)
    return str(content)

# ── Nodes ──────────────────────────────────────────────────────────────────────
def create_itinerary(state: PlannerState) -> PlannerState:
    response = llm.invoke(
        itinerary_prompt.format_messages(
            city=state["city"],
            interests=", ".join(state["interests"])
        )
    )
    text = _extract_text(response.content)
    return {
        **state,
        "itinerary": text,
        "messages": state["messages"] + [AIMessage(content=text)]
    }

# ── Graph ──────────────────────────────────────────────────────────────────────
workflow = StateGraph(PlannerState)
workflow.add_node("create_itinerary", create_itinerary)
workflow.set_entry_point("create_itinerary")
workflow.add_edge("create_itinerary", END)

graph = workflow.compile()

# ── Public API function ────────────────────────────────────────────────────────
def plan_trip(city: str, interests: List[str]) -> str:
    """
    Given a city and a list of interests, run the LangGraph workflow
    and return the generated itinerary string.
    """
    initial_state: PlannerState = {
        "messages": [HumanMessage(content=f"Plan a day trip to {city}.")],
        "city": city,
        "interests": interests,
        "itinerary": ""
    }
    final_state = graph.invoke(initial_state)
    return final_state["itinerary"]