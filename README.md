# FlightPlan, Backend API

The server side of FlightPlan, a career services platform built for OC students. This is the Node.js/Express API that handles everything the frontend talks to: authentication, user sessions, data access, and business logic.

This backend is birarenze work, because the students who use FlightPlan need something that actually holds together under real conditions.

---

## What It Does

- Google OAuth authentication restricted to `@oc.edu` accounts
- RESTful API endpoints for career services data
- MVC architecture with models, controllers, and routes separated cleanly
- Structured for easy extension across multiple feature branches

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Auth:** Google OAuth
- **Structure:** MVC (`app/` directory)
- **Entry:** `app.js`

---

## Project Structure

```
flightplanback-end/
├── app/             # MVC: models, controllers, routes
├── front-end/src/   # Frontend integration point
├── app.js           # Application entry point
├── package.json
└── .gitignore
```

---

## Getting Started

```bash
git clone https://github.com/lacebx/flightplanback-end.git
cd flightplanback-end
npm install
node app.js
```

Note: The active code lives on the feature branches (`yesu`, `demofinal`, `yohoo`, etc.), not main.

---

## Frontend

Pair this backend with [flightplan-fro](https://github.com/lacebx/flightplan-fro), the Vue.js frontend for the FlightPlan career services platform.
