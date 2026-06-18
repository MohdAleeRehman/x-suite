# X Suite — Real Estate Solutions
### Vue 3 + Vite | Node.js + Express | MongoDB Atlas | JWT Auth

---

## 🏗️ Project Structure

```
x-suite/
├── backend/                  # Node.js + Express API
│   ├── models/
│   │   ├── User.js           # Mongoose User model (bcrypt)
│   │   └── Record.js         # Mongoose Record model (sale/rent/prop)
│   ├── routes/
│   │   ├── auth.js           # POST /login, GET /me, POST /seed
│   │   └── records.js        # CRUD for all record types
│   ├── middleware/
│   │   └── auth.js           # JWT protect middleware
│   ├── server.js             # Express app entry point
│   ├── seed.js               # One-time user seeder
│   ├── .env                  # Environment variables
│   └── package.json
│
└── frontend/                 # Vue 3 + Vite SPA
    ├── src/
    │   ├── assets/
    │   │   └── main.css      # Global HSBC-style CSS
    │   ├── components/
    │   │   ├── AppLayout.vue     # Nav + footer wrapper
    │   │   ├── SaleResults.vue   # Sale calculator results (3 tabs)
    │   │   ├── RentResults.vue   # Rent calculator results
    │   │   └── PropertyProfile.vue # Property fact-sheet
    │   ├── views/
    │   │   ├── LoginView.vue
    │   │   ├── DashboardView.vue
    │   │   ├── SaleView.vue
    │   │   ├── RentView.vue
    │   │   ├── PropertyView.vue
    │   │   └── RecordsView.vue
    │   ├── stores/
    │   │   ├── auth.js       # Pinia auth store
    │   │   └── records.js    # Pinia records store
    │   ├── router/
    │   │   └── index.js      # Vue Router with auth guard
    │   ├── utils/
    │   │   ├── api.js        # Axios with JWT interceptors
    │   │   ├── calculations.js # All financial calculation logic
    │   │   └── pdfExport.js  # jsPDF + html2canvas export
    │   ├── App.vue
    │   └── main.js
    ├── .env
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Step-by-Step Setup (Local Development)

### Prerequisites
- Node.js v18 or higher
- npm v8 or higher
- MongoDB Atlas account (URI already in `.env`)

---

### Step 1 — MongoDB Atlas IP Whitelist

The MongoDB Atlas connection requires your IP to be whitelisted:

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign in → Select **X-Suite** cluster
3. Click **Network Access** in the left sidebar
4. Click **+ ADD IP ADDRESS**
5. Click **ALLOW ACCESS FROM ANYWHERE** (0.0.0.0/0) for development
   — OR — enter your specific IP
6. Click **Confirm**
7. Wait ~30 seconds for the change to propagate

---

### Step 2 — Backend Setup

```bash
# Navigate to backend
cd x-suite/backend

# Install dependencies
npm install

# Create the umair user in MongoDB (run once)
node seed.js
# Expected output:
# ✅ Connected to MongoDB Atlas
# ✅ User created successfully!
#    Username: umair
#    Password: umair@xsuite2026

# Start the development server
npm run dev
# Expected output:
# ✅ Connected to MongoDB Atlas
# 🚀 X Suite API running on port 5000
```

The backend API is now running at `http://localhost:5000`

---

### Step 3 — Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend
cd x-suite/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# Expected output:
# VITE v5.x.x ready in xxx ms
# ➜ Local: http://localhost:5173/
```

---

### Step 4 — Login

Open your browser and go to: **http://localhost:5173**

Login credentials:
- **Username:** `umair`
- **Password:** `umair@xsuite2026`

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login and get JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/seed` | Create umair user (alt. method) | No |
| GET | `/api/records` | Get all user records | Yes |
| POST | `/api/records` | Create a new record | Yes |
| GET | `/api/records/:id` | Get a single record | Yes |
| PUT | `/api/records/:id` | Update a record | Yes |
| DELETE | `/api/records/:id` | Delete a record | Yes |
| GET | `/api/health` | Health check | No |

---

## 🔐 Authentication Flow

1. User submits login form → POST `/api/auth/login`
2. Backend verifies bcrypt password → returns JWT (7-day expiry)
3. JWT stored in `localStorage` as `xsuite_token`
4. All API calls include `Authorization: Bearer <token>` header
5. Vue Router guards redirect unauthenticated users to `/login`
6. 401 responses automatically clear token and redirect to login

---

## 📊 Record Types

### Sale Record (`type: "sale"`)
Stores full sale calculator inputs including prices, fees, commissions, utility payer assignments.

### Rent Record (`type: "rent"`)
Stores rental inputs: annual rent, cheques, SEWA deposit, furnishing class, commission.

### Property Record (`type: "prop"`)
Stores property fact-sheet: building details, dimensions, pricing, status, ROI metrics.

---

## 📄 PDF Export

Each results view includes a **⬇ Download PDF Report** button.
- Uses `html2canvas` to render the results section as an image
- Uses `jsPDF` to generate a multi-page PDF
- PDF automatically named with record type and timestamp
- Maintains the same visual appearance as the on-screen report

---

## ✅ Feature Checklist

- [x] JWT authentication with bcrypt password hashing
- [x] Single user account (umair)
- [x] MongoDB Atlas with Mongoose schemas
- [x] Sale calculator with Buyer / Seller / Summary tabs
- [x] Rent calculator with cheque schedule
- [x] Property profile fact-sheet
- [x] Records CRUD (create, read, update, delete)
- [x] Edit records pre-populates form fields
- [x] View records shows result directly (no form)
- [x] PDF export for all 3 report types
- [x] Vue Router with auth guards
- [x] Pinia stores for auth + records
- [x] Axios with JWT interceptors
- [x] HSBC-inspired design system fully preserved
- [x] Responsive layout (mobile + desktop)
- [x] Environment variables (.env files)
# x-suite
