# 🔗 URL Shortener

A modern, responsive, and fully client-side **URL Shortener** application built with **React**, **TypeScript**, **Vite**, and styled using **Material UI**. This project allows users to generate short links with optional custom codes and expiration durations, and also provides in-depth analytics for each shortened URL — all handled seamlessly within the browser using `localStorage`.

---

## 🚀 Features

- **Batch URL Shortening**: Shorten up to 5 URLs at the same time.
- **Custom Shortcodes**:
  - Define your own alphanumeric shortcode (4–10 characters).
  - Automatically generates one if not specified.
- **Expiration Control**: Set optional validity (in minutes). Defaults to **30 minutes**.
- **In-Browser Redirection**: Utilizes **React Router** for fast, client-side redirects.
- **Analytics Dashboard**:
  - Track total clicks for each link.
  - View timestamp, referrer, and a mock geolocation for each click.
- **Responsive UI**: Optimized for desktops, tablets, and mobile devices using **Material UI**.
- **Robust Validation & Error Handling**: Handles invalid URLs, shortcode collisions, and expired links gracefully.
- **Custom Logging Middleware**:
  - Logs major user interactions and app events.
  - Sends logs to a remote logging service using **Axios**.

---

## 📸 Responsive Screenshots

### 🔧 URL Shortener Page

| Desktop                                                                 | Mobile                                                                  |
|-------------------------------------------------------------------------|-------------------------------------------------------------------------|
| ![](./screenshots/shortener-page-desktop.png)                          | ![](./screenshots/shortener-page-mobile.png)                           |

### 📊 Analytics Page

| Desktop                                                                 | Mobile                                                                  |
|-------------------------------------------------------------------------|-------------------------------------------------------------------------|
| ![](./screenshots/stats-page-desktop.png)                              | ![](./screenshots/stats-page-mobile.png)                               |
| _Full table layout_                                                    | _Horizontal scroll enabled for accessibility_                          |

---

## 🛠 Tech Stack

- **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI**: [Material UI](https://mui.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Logging**: [Axios](https://axios-http.com/) for sending logs
- **Unique ID Generation**: [`nanoid`](https://github.com/ai/nanoid)
- **Date Utilities**: [`date-fns`](https://date-fns.org/)
- **Data Storage**: `localStorage` (acts as a mock database)

---

## 📂 Project Structure

📁 root/
├── 📁 Logging-Middleware/
│ └── logger.ts # Custom reusable logging middleware
├── 📁 Frontend-Test-Submission/
│ ├── 📁 src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # Main app pages
│ │ ├── services/ # URL and logging logic
│ │ ├── App.tsx # Routes and redirection handler
│ │ └── main.tsx # Entry point
│ └── package.json
└── README.md

## 🧪 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 🧰 Installation

```bash
git clone https://github.com/Utkrisht2/22131012585.git
cd 22131012585/Frontend-Test-Submission
npm install

▶️ Run the Application
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 in your browser to start using the app.

📱 How to Capture Mobile Screenshots
Open the app in your browser.

Press F12 or Ctrl+Shift+I (DevTools).

Click the device icon (top-left in DevTools).

Select a device (e.g., iPhone 12).

Refresh and take a screenshot.

⚙️ Core Logic Overview
🔄 Shortening Flow
On submission, form input is validated.

If a shortcode is not supplied, one is generated using nanoid.

A ShortenedUrl object is created and stored in localStorage.

Each short URL is associated with its:

Original URL

Click history

Expiration timestamp

🔁 Redirection Handler
Defined using a wildcard route (/:shortcode).

Fetches the original URL using urlService.

Logs the access with:

Timestamp

Referrer (source)

Mocked geolocation

Redirects the user via window.location.replace().

📋 Logging Middleware
The application includes a reusable logger:

Captures events like URL creation, redirection, and form errors.

Sends log data using Axios to a remote test server.

Can be extended to include user/device metadata, event tags, and more.

ts
Copy
Edit
// Example log
logEvent("SHORT_URL_CREATED", {
  shortcode: "abcd12",
  url: "https://example.com",
  timestamp: new Date().toISOString()
});