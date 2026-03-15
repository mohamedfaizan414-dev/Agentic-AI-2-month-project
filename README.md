# 🌍 AI Travel Agent

An intelligent **AI-powered travel assistant** that helps users plan complete trips through a conversational interface.
This project combines **modern web development with AI automation** to create a system that can assist users with travel planning, recommendations, and itinerary creation.

The AI agent can understand travel-related questions and help users plan trips by suggesting destinations, accommodations, transport options, food, and activities.

---

# ✨ Features

## 🤖 Conversational AI Travel Planning

Users can chat with the AI assistant to plan their entire trip. The agent understands natural language and provides relevant travel suggestions.

Examples of queries the agent can handle:

* Plan a 3-day trip to Paris
* Suggest budget hotels in Tokyo
* What food should I try in Italy?
* Best places to visit in Switzerland
* Train availability between cities

---

## 🧭 Trip Recommendations

The agent can suggest:

* Popular tourist attractions
* Hidden travel destinations
* Cultural experiences
* Local food recommendations
* Travel tips and advice

---

## 🏨 Accommodation Suggestions

The system can recommend hotels and accommodations based on user preferences such as:

* Budget
* Location
* Travel duration
* Destination popularity

---

## 🚆 Transportation Guidance

The AI assistant can provide information about:

* Train availability
* Travel routes between destinations
* Suggested transportation methods

---

## 💬 Chat-Based Interface

Users interact with the system through a **chat interface**, making the experience feel like talking to a real travel assistant.

Each conversation is saved as a session so users can continue their travel planning later.

---

## 🧑‍💻 User Authentication

The system includes a secure authentication system that allows users to:

* Register accounts
* Log in securely
* Access their personal chat history
* Save travel conversations

Authentication is implemented using:

* JSON Web Tokens
* Secure cookies
* Password hashing

---

## 🧠 AI Integration

The chat system connects to an AI agent backend which processes user queries and generates intelligent responses.

The AI agent can:

* Understand travel intent
* Suggest personalized recommendations
* Provide contextual travel planning advice

---

# 🏗️ Tech Stack

## Frontend

* React.js
* Modern UI components
* Chat-based interaction interface

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JSON Web Tokens (JWT)
* bcrypt password hashing
* Cookie-based authentication

## AI Integration

* Langgraph langchain Based Agent
* Intelligent conversational responses

---

# 📂 Project Structure

```
Travel Agent
│
├── AI backend
│
├── express backend
│   ├── src
│   │   ├── controllers
│   │   │   ├── auth.controller.js
│   │   │   └── chat.controller.js
│   │   │
│   │   ├── db
│   │   │   └── db.js
│   │   │
│   │   ├── middleware
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── model
│   │   │   ├── chat.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes
│   │   │   ├── auth.routes.js
│   │   │   └── chat.routes.js
│   │   │
│   │   └── app.js
│   │
│   └── server.js
│
└── frontend
    └── Travel Agent
```

---

# ⚙️ Installation

Clone the repository:

```
git clone https://github.com/yourusername/travel-agent.git
```

Navigate into the backend folder:

```
cd express-backend
```

Install dependencies:

```
npm install
```

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Start the backend server:

```
npm start
```

---

# 🌐 API Endpoints

## Authentication

### Register User

```
POST /api/auth/register
```

Creates a new user account.

---

### Login User

```
POST /api/auth/login
```

Authenticates a user and creates a secure session.

---

### Get Current User

```
GET /api/auth/me
```

Returns authenticated user information.

---

## Chat

### Send Message

```
POST /api/chat
```

Sends a message to the AI agent and receives a response.

---

### Get Chat Sessions

```
GET /api/sessions
```

Returns all conversation sessions for the logged-in user.

---

### Get Chat History

```
GET /api/history/:id
```

Returns all messages for a specific conversation.

---

# 🧠 How the AI Agent Works

1. The user sends a message from the chat interface.
2. The backend stores the message in the database.
3. The message is sent to the AI agent service.
4. The AI generates a response.
5. The response is saved and returned to the user.

This allows conversations to persist across sessions.

---

# 🔒 Security Features

The system includes multiple security layers:

* Password hashing with bcrypt
* JWT authentication
* HTTP-only cookies
* Protected routes using middleware

These measures ensure user data and conversations remain secure.

---

# 🚀 Future Improvements

This project is actively being developed. Planned features include:

* Train ticket booking integration
* Hotel booking automation
* Flight search and booking
* Personalized itinerary generation
* Budget optimization for trips
* Multi-destination trip planning
* Real-time travel alerts
* Map-based travel recommendations
* AI memory for personalized travel preferences

---

# 🎯 Project Goal

The goal of this project is to build a **fully autonomous AI travel assistant** that can handle the entire travel planning workflow for users — from inspiration to booking.

Eventually, the system will evolve into a **complete AI-powered travel planning platform** capable of:

* Planning entire trips
* Booking transportation
* Managing accommodations
* Providing personalized recommendations

---

# 👨‍💻 Author

Developed by a passionate developer exploring **AI agents, full-stack development, and intelligent automation**.

---

# ⭐ Contributions

Contributions, suggestions, and feedback are welcome.
Feel free to fork the repository and submit pull requests.

---


