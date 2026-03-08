✈️ AI-Driven Agentic Travel Consultant
An intelligent, agentic travel assistant built using LangGraph and Groq. This project leverages a state-machine architecture to handle complex travel planning, deterministic data validation, and real-time tool usage to provide premium travel consultancy.

🚀 Overview
This repository hosts a travel consultant agent designed to move beyond simple LLM prompts. It uses a structured workflow to:

Validate User Inputs: Ensures dates, budgets, and traveler counts are logically sound before proceeding.

Agentic Reasoning: Utilizes an agent executor to decide when to call external tools (Search, Currency Exchange) vs. when to respond directly.

Token Optimization: Implements custom message trimming and sliding-window context management to operate efficiently within API rate limits (TPM).

🛠️ Tech Stack
Orchestration: LangGraph (State-based workflows)

LLM Provider: Groq (Llama-3 models)

Framework: LangChain

Validation: Python-based deterministic logic

🏗️ Architecture
The system is designed as a graph with the following nodes:

Validation Node: A deterministic code block that checks for date logic (e.g., return date after departure) and budget feasibility.

Thinking Brain (Agent Node): The "core" of the assistant. It evaluates the current state, addresses validation issues, and uses tools if real-time data is required.

Itinerary Generator: A final node that synthesizes all gathered information into a premium, detailed travel plan.

🔧 Key Features Included
Deterministic Validation: Prevents the LLM from hallucinating or accepting impossible travel dates.

Tool Integration: Seamless binding of search and financial tools for real-time accuracy and a train search tool which gives you available train details.

TPM Management: Custom logic to trim message history, preventing "Request too large" (413) errors and staying under token-per-minute limits.

🛣️ Roadmap: The Path to "Great Agentic"
This project is currently in its initial phase. As part of a dedicated 2-month development cycle, the following advanced agentic features are planned:

[ ] Multi-Agent Collaboration: Splitting tasks between a "Budget Specialist Agent" and a "Geography Agent."

[ ] Long-Term Memory: Implementing a database to remember user preferences across different sessions.

[ ] Human-in-the-loop: Adding checkpoints where the agent pauses for user confirmation before executing "expensive" tool actions.

[ ] Dynamic Itinerary Refinement: Allowing the user to modify specific parts of a plan without regenerating the entire document.

💻 Getting Started
Clone the repo:

Bash
git clone https://github.com/mohamedfaizan414-dev/Agentic-AI-2-month-project.git
Install dependencies:

Bash
pip install -r requirements.txt
Set up Environment Variables:
Create a .env file and add your keys:

Code snippet
GROQ_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
Author: Mohamed Faizan

B.Tech CSE (AI/ML) Student at LPU Punjab
