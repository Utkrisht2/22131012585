🔗 Client-Side URL Shortener
A lightweight, fully client-side URL shortening application built with React, TypeScript, and Vite, styled using Material UI. This app supports customized shortcodes, link expiration, detailed click tracking, and a clean responsive UI—all backed by localStorage for persistence.

💡 Designed for performance, usability, and mobile-friendliness without requiring a backend.

🚀 Features Overview
Batch Shortening – Shorten up to 5 URLs simultaneously.

Custom Shortcodes – Optionally define your own alphanumeric shortcode (4–10 characters).

Expiry Support – Set how long each link stays valid (default: 30 minutes).

Analytics Dashboard – View click counts, referrer data, and simulated location insights.

Instant Redirection – Short links redirect client-side via React Router.

Error Feedback – Smart UI alerts for invalid inputs, duplicates, and expired links.

Event Logging – Integrated logging middleware that reports actions to a mock remote server.

Responsive UI – Seamlessly works across mobile and desktop devices.

🖥️ UI Responsiveness Preview
📄 Shorten URLs Page
💻 Desktop View	📱 Mobile View
	

📊 Statistics & Analytics Page
💻 Desktop View	📱 Mobile View
	
Full-width layout with detailed columns	Swipe-friendly horizontal scrolling on smaller devices

🧱 Tech Stack
Tool	Purpose
React + Vite	UI framework + build tooling
TypeScript	Static typing for scalability
Material UI	UI components & styling
React Router	Routing & redirection
Axios	Logging API calls
nanoid	Short, URL-safe ID generation
date-fns	Date/time formatting utilities
localStorage	Data persistence (no backend)

📁 Project Structure
bash
Copy
Edit
├── Logging-Middleware/         # Standalone logging utility
└── Frontend-Test-Submission/   # Main app (React + Vite)
⚙️ Getting Started
Prerequisites
Ensure you have the following installed:

Node.js (v18+ recommended)

npm (comes with Node)

Installation
bash
Copy
Edit
git clone https://github.com/Utkrisht2
cd your-repo-folder/Frontend-Test-Submission
npm install
Development Server
bash
Copy
Edit
npm run dev
Open your browser at http://localhost:3000 to use the app.

📷 Capturing Mobile Screenshots
Open your browser (Chrome/Firefox/Edge).

Press F12 to open DevTools.

Click the device toolbar icon (📱).

Choose a device (e.g., iPhone 13).

Refresh and take a screenshot.

🔍 How It Works
📦 URL Management
The urlService.ts file mimics a backend and handles:

Generating shortcodes (or validating custom ones).

Saving URL metadata with creation and expiry timestamps.

Retrieving and updating localStorage-stored URLs.

🔁 Redirection Logic
A dynamic route (/:shortcode) is handled via RedirectHandler.

It:

Resolves the shortcode to a long URL.

Tracks click data (time, referrer, geo mock).

Redirects using window.location.replace().

🧾 Logging System
The logging middleware captures app events.

Sends structured log entries to a mock remote endpoint using Axios.

Useful for tracking usage, debugging, and audit trails.

🛠️ Development Notes
All logic is contained client-side.

No real geolocation or backend API involved—click location is mocked.

Link stats persist only in the user's browser (localStorage).