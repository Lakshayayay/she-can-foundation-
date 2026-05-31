# She Can Foundation Web Portal

A secure, responsive full-stack contact portal and administrative panel built for the **She Can Foundation**. Designed matching the exact typography and color themes of the official website.

## Project Structure

```
├── backend/                  # Node.js + Express API
│   ├── .env                  # Port, MongoDB URI, Admin Credentials
│   ├── server.js             # Main server logic, Schemas, CORS & Limiting
│   └── package.json          # Server dependencies
│
├── frontend/                 # Vite + React Client
│   ├── src/
│   │   ├── App.jsx           # Home portal form & layout
│   │   ├── Admin.jsx         # Administrative interface
│   │   ├── main.jsx          # Vite React mounting
│   │   └── index.css         # Tailwind & Typography layers
│   ├── tailwind.config.js    # NGO design system token overrides
│   └── package.json          # Client dependencies
│
├── design-system/            # UI/UX Pro Max generated assets
├── package.json              # Orchestrated run scripts
└── .gitignore                # Target ignores
```

## Features

- **NGO Brand Visuals:** Enforces standard colors (`#ED0707` and `#130705`) and preloaded typography (`Poppins` & `DM Sans`).
- **Input Validation:** Real-time client-side checks and server-side validation to block spam or bad submissions.
- **Express Rate Limiting:** Blocks brute-force script runs and abuse.
- **Secure Admin Panel:** Accessible via `/admin` tab, gated with JWT signature verify. Shows submissions in clean responsive card lists.
- **MongoDB Integration:** Saves name, email, message, and timestamp entries dynamically.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v10+)
- MongoDB (running locally on port 27017)

### Installation
From the root directory, install both frontend and backend dependencies using:
```bash
npm run install-all
```

### Configuration
Verify the configuration values in the env files:
- **Backend:** `backend/.env`
  - `PORT=5001`
  - `MONGO_URI=mongodb://127.0.0.1:27017/she_can_foundation`
  - `ADMIN_PASSWORD=admin123`
  - `JWT_SECRET=shecanfoundationsecretjwtkey`
- **Frontend:** `frontend/.env`
  - `VITE_API_URL=http://localhost:5001`

### Running the Services
1. **Start the backend server:**
   ```bash
   npm run start-backend
   ```
2. **Start the frontend web app:** (in a separate terminal)
   ```bash
   npm run start-frontend
   ```

Open your browser to the local URL (usually `http://localhost:5173`) to view the application.

---

## Admin Credentials
- **Access Link:** Click "Admin Panel" in the header navigation menu.
- **Password:** `admin123`
