# ZawariFlow

**ZawariFlow** is a supply chain payment orchestration platform that enables businesses to manage purchase orders, suppliers, virtual accounts, collections, and settlements from a centralized dashboard.

The platform simplifies business-to-business (B2B) payments by allowing companies to:

* Create and manage purchase orders
* Onboard and manage suppliers
* Generate dedicated virtual accounts for collections
* Track incoming payments in real time
* Split and settle payments to multiple suppliers
* Monitor financial activities through a live dashboard

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Shadcn UI
* Recharts
* Lucide React

## Backend

* Django
* Django REST Framework
* PostgreSQL
* JWT Authentication
* drf-spectacular (Swagger Documentation)

## Payment Provider

* Monnify API

---

# Project Structure

```
zawariflow/
│
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── companies/
│   │   ├── dashboard/
│   │   └── payments/
│   │
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.ts
```

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Company Profile
* Role-based Access Control

---

## Company Management

* Create Company
* Update Company
* Invite Team Members
* Assign Roles

---

## Supplier Management

* Register Suppliers
* Supplier Categories
* Supplier Verification Status
* Bank Account Management
* Transaction History

---

## Purchase Orders

* Create Purchase Orders
* Manage Purchase Order Items
* Approve Purchase Orders
* Track Purchase Order Status

---

## Virtual Accounts

* Create Dedicated Virtual Accounts
* Automatic Account Assignment
* Real-time Payment Tracking

---

## Payments

* Incoming Payment Tracking
* Payment Webhooks
* Settlement Processing
* Payment History

---

## Dashboard

* Total Settled Volume
* Pending Settlements
* Active Suppliers
* Open Purchase Orders
* Settlement Volume Chart
* Split Breakdown
* Recent Activities

---

# Requirements

Before running the project, install:

* Python 3.12+
* Node.js 20+
* PostgreSQL
* Git

---

# Backend Setup

## 1. Clone the repository

```bash
git clone https://github.com/your-org/zawariflow.git

cd zawariflow
```

---

## 2. Navigate into the backend

```bash
cd backend
```

---

## 3. Create a virtual environment

### Windows

```bash
python -m venv .venv
```

### Linux / macOS

```bash
python3 -m venv .venv
```

---

## 4. Activate the virtual environment

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

---

## 5. Install dependencies

```bash
uv sync
```

---

## 6. Create a `.env` file

Create a file named:

```
.env
```

inside the **backend** directory.

Example:

```env

MONNIFY_BASE_URL=https://sandbox.monnify.com MONNIFY_API_KEY=your-api-key MONNIFY_SECRET_KEY=your-secret-key MONNIFY_CONTRACT_CODE=your-contract-code MONNIFY_SOURCE_ACCOUNT=your-source-account

```

Update these values according to your environment.

---

## 7. Apply migrations

```bash
python manage.py makemigrations

python manage.py migrate
```

---

## 8. Create a superuser

```bash
python manage.py createsuperuser
```

---

## 9. Run the backend

```bash
python manage.py runserver
```

Backend runs on

```
http://127.0.0.1:8000
```

---

# Frontend Setup

## 1. Open another terminal

Navigate to the frontend folder.

```bash
cd frontend
```

---

## 2. Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

## 3. Create a `.env` file

Example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## 4. Run the frontend

```bash
npm run dev
```

or

```bash
pnpm dev
```

Frontend runs on

```
http://localhost:5173
```

---

# API Documentation

Swagger UI

```
http://127.0.0.1:8000/api/docs/
```

OpenAPI Schema

```
http://127.0.0.1:8000/api/schema/
```

---

# Running the Complete Application

Start the backend

```bash
cd backend

python manage.py runserver
```

Open another terminal

```bash
cd frontend

npm run dev
```

Visit

```
http://localhost:5173
```

---

# Default Development Flow

1. Register a new account.
2. Create your company profile.
3. Add suppliers.
4. Create purchase orders.
5. Generate virtual accounts.
6. Receive payments.
7. Process settlements.
8. Monitor activities from the dashboard.

---


---

# Scripts

## Backend

```bash
python manage.py runserver
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
```

---

## Frontend

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

# Contributors

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to your branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---


---

## Authors

Developed with by the **ZawariFlow Team**.
