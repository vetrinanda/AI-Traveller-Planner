<div align="center">

# ✈️ TripCraft — AI Day Trip Planner

**Generate a stunning, personalised day-trip itinerary for any city in seconds — powered by Google Gemini AI, LangGraph, FastAPI, and React.**

[![Python](https://img.shields.io/badge/Python-3.13%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.129%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.0%2B-FF6B35?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

## 📸 Overview

**TripCraft** is a full-stack AI application that creates rich, hour-by-hour day-trip itineraries tailored to your chosen city and personal interests. Simply pick a destination, select what excites you, and let Gemini AI generate a professional, detailed travel plan — complete with timings, local tips, and curated activity suggestions.

### Key Highlights

- 🤖 **Gemini 2.0 Flash** — fast, high-quality itinerary generation
- 🔗 **LangGraph workflow** — structured AI agent pipeline with typed state
- ⚡ **FastAPI backend** — async-ready REST API with rate limiting
- 🎨 **Premium React UI** — glassmorphism, animated gradients, Plus Jakarta Sans font
- 🏷️ **Shadcn-inspired components** — built on Radix UI primitives
- 📋 **Copy & Download** — export your itinerary as a `.txt` file
- 🔒 **Rate limiting** — SlowAPI protects against abuse

---

## 🏗️ Architecture

```
AI Traveller Planner/
├── backend/
│   ├── app/
│   │   ├── agents.py      # LangGraph AI workflow (PlannerState + graph)
│   │   ├── main.py        # FastAPI app, routes, CORS, rate limiting
│   │   └── limiter.py     # SlowAPI rate limiter configuration
│   ├── main.py            # Uvicorn entry-point
│   ├── pyproject.toml     # Python dependencies (uv)
│   ├── requirements.txt   # Pip-compatible dependency list
│   └── .env               # GOOGLE_API_KEY (not committed)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   └── index.jsx       # Shadcn-style primitives (Button, Badge, Card…)
    │   │   ├── CityInput.jsx       # City autocomplete with flags & descriptions
    │   │   ├── InterestSelector.jsx # Interest chip grid + custom input
    │   │   ├── LoadingState.jsx    # Orbital spinner with step progression
    │   │   └── ItineraryDisplay.jsx # Rendered itinerary with copy/download
    │   ├── lib/
    │   │   └── utils.js            # cn() utility (clsx + tailwind-merge)
    │   ├── App.jsx                 # Main app with 4-step flow
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Design system CSS (tokens, animations)
    ├── index.html
    ├── vite.config.js              # Vite + Tailwind v4 + proxy to backend
    └── package.json
```

---

## ✨ Features

### 🧠 AI & Backend
| Feature | Details |
|---|---|
| **LangGraph Agent** | Typed `PlannerState` → `create_itinerary` node → `END`. Clean, extensible pipeline |
| **Gemini 2.0 Flash** | Fast, cost-effective LLM with structured system + human prompt |
| **Smart Content Parsing** | `_extract_text()` handles both plain-string and content-block list responses from the Gemini API |
| **FastAPI REST API** | `POST /plan` with Pydantic request/response validation |
| **Rate Limiting** | SlowAPI — 5 requests/day per IP by default |
| **CORS Middleware** | Pre-configured for frontend dev, tighten `allow_origins` for production |
| **Auto-reload** | Uvicorn `--reload` for seamless backend development |

### 🎨 Frontend UI
| Feature | Details |
|---|---|
| **3-Step Flow** | Destination → Interests → Itinerary with animated step progress bar |
| **City Autocomplete** | Dropdown with 18 pre-loaded cities, flags, and taglines |
| **Interest Chips** | 14 preset categories + custom interest input |
| **Loading Screen** | Orbital ring spinner with rotating step labels |
| **Itinerary Renderer** | Full markdown parser — headings, bullets, bold, italic, numbered lists |
| **Copy to Clipboard** | One-click copy with ✓ confirmation feedback |
| **Download as TXT** | Exports the itinerary as a named `.txt` file |
| **Quick Picks** | Click a popular city (Paris, Tokyo, Bali…) to pre-fill the input |
| **Mesh Background** | Animated radial gradient mesh + CSS noise texture |
| **Animated Gradient Border** | CSS pseudo-element gradient border on key cards |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.13+** and **uv** (or pip)
- **Node.js 18+** and **npm**
- A **Google AI Studio API key** — [get one free here](https://aistudio.google.com/app/apikey)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-traveller-planner.git
cd "ai-traveller-planner"
```

---

### 2. Backend setup

```bash
cd backend

# Create a virtual environment and install dependencies
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

Start the backend server:

```bash
python main.py
# Server runs at http://localhost:8000
```

API docs are auto-generated at **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
# Dev server runs at http://localhost:5173
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

> The Vite dev server proxies `/api/*` → `http://localhost:8000` automatically, so no manual CORS configuration is needed during development.

---

## 🔌 API Reference

### `GET /`
Health check.

**Response:**
```json
{ "message": "AI Traveller Planner API is running 🌍" }
```

---

### `POST /plan`
Generate a day-trip itinerary.

**Request body:**
```json
{
  "city": "Paris",
  "interests": ["art", "food", "history"]
}
```

**Response:**
```json
{
  "city": "Paris",
  "interests": ["art", "food", "history"],
  "itinerary": "## Morning\n- 08:00 AM – Visit the Louvre..."
}
```

**Rate limit:** 5 requests per day per IP.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **LLM** | Google Gemini 2.0 Flash (`gemini-2.0-flash`) |
| **AI Framework** | LangGraph 1.0 + LangChain Core |
| **Backend** | FastAPI 0.129, Uvicorn, Pydantic v2 |
| **Rate Limiting** | SlowAPI 0.1.9 |
| **Frontend** | React 19, Vite 8 |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Component Layer** | Radix UI primitives (`@radix-ui/react-slot`) |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Font** | Plus Jakarta Sans (Google Fonts) |
| **Package Manager (BE)** | uv / pip |
| **Package Manager (FE)** | npm |

---

## ⚙️ Configuration

### Backend environment variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_API_KEY` | ✅ Yes | Your Google AI Studio API key |

### Changing the model

In `backend/app/agents.py`, update the `model` parameter:

```python
llm = ChatGoogleGenerativeAI(
    api_key=os.getenv("GOOGLE_API_KEY"),
    model="gemini-2.0-flash",   # ← change here
    temperature=0
)
```

### Changing the rate limit

In `backend/app/main.py`:

```python
@limiter.limit("5/day")   # ← change to e.g. "20/hour"
def plan(request: Request, body: PlanRequest):
```

---

## 🗺️ How It Works

```
User Input (city + interests)
        │
        ▼
  React Frontend
  POST /api/plan
        │
        ▼
  FastAPI  →  Rate Limiter check
        │
        ▼
  plan_trip(city, interests)
        │
        ▼
  LangGraph Graph
  ┌─────────────────────┐
  │  PlannerState       │
  │  ┌───────────────┐  │
  │  │create_itinerary│  │
  │  │  LLM.invoke() │  │
  │  └───────┬───────┘  │
  │          │ END      │
  └──────────┼──────────┘
             │
             ▼
  _extract_text(response.content)
             │
             ▼
  Itinerary string → PlanResponse
             │
             ▼
  Frontend renders formatted itinerary
```

---

## 🧪 Development Tips

### Running both servers simultaneously

Open two terminals:

```bash
# Terminal 1 – Backend
cd backend && python main.py

# Terminal 2 – Frontend
cd frontend && npm run dev
```

### Testing the API directly

```bash
curl -X POST http://localhost:8000/plan \
  -H "Content-Type: application/json" \
  -d '{"city": "Tokyo", "interests": ["food", "art", "history"]}'
```

Or use the interactive docs at **http://localhost:8000/docs**

---

## 🚢 Deployment

### Backend (e.g. Render / Railway)
1. Set `GOOGLE_API_KEY` as an environment variable in your hosting dashboard
2. Set the start command to: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
3. Update `allow_origins` in `main.py` with your frontend's deployed URL

### Frontend (e.g. Vercel / Netlify)
1. Update the `axios.post` base URL in `App.jsx` to point to your deployed backend
2. Build with `npm run build` — output is in `dist/`

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ using **Gemini AI** · **LangGraph** · **FastAPI** · **React**

</div>
