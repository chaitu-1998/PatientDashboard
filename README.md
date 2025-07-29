# 🩺 Patient Dashboard - Full Stack App (Admin & User Roles)

A full-stack web application for managing patient records. This app allows admins to add, update, and view patients, while users can submit patient info. Role-based login and JWT token authentication is included.

## 🔧 Tech Stack

- **Frontend**: React, Axios, Tailwind CSS, React Router
- **Backend**: Spring Boot 3, Java 17, Spring Security with JWT
- **Database**: H2 (in-memory) or PostgreSQL/MySQL (configurable)
- **Build Tools**: Gradle, Vite
- **APIs used for Auto-Suggestions**:
  - https://restcountries.com
  - https://countriesnow.space
  - https://nominatim.openstreetmap.org

---

## 📁 Project Structure

```bash
PatientDashboard/
├── patientDashboardFrontend/     # React Frontend
└── PatientDashboardBackend/        # Spring Boot Backend
```

---

## 🚀 Getting Started

change the database credentails in application.properties

### 📌 Prerequisites

- Java 17
- Node.js (v18+)
- npm or yarn
- Gradle
- Git

---

## 🧪 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/chaitu-1998/patient-dashboard.git
cd patient-dashboard
```

---

### 2. Backend Setup (Spring Boot)

```bash
cd PatientDashboardBackend
./gradlew build
./gradlew bootRun
```

🖥️ Runs on: `http://localhost:8080`

---

### 3. Frontend Setup (React)

```bash
cd ../patient-dashboard-frontend
npm install
npm run dev
```

🖥️ Runs on: `http://localhost:5173`

---

## 🔐 Authentication

Use these hardcoded logins:

| Role   | Username | Password  |
|--------|----------|-----------|
| Admin  | admin    | admin123  |
| User   | user     | user123   |

JWT token is stored in `localStorage` and added to API requests automatically.

---

## 📌 Features

### ✅ Admin

- Add new patient
- View all patients
- Update patient status (Inquiry, Onboarding, Active, Churned)
- Auto-suggestions for address fields
- Role-based routing
- Protected endpoints using JWT
- Global search in patient list

### ✅ User

- Submit patient info
- Can only add, not view/update other records
- Restricted routes via token role

---

## 🧠 API Endpoints

### Auth
```
POST /api/patients/login
```

### Patients

| Method | Endpoint                         | Description                       |
|--------|----------------------------------|-----------------------------------|
| GET    | `/api/patients`                 | Admin-only: Get all patients      |
| POST   | `/api/patients/create`          | Add patient (Admin/User)          |
| PUT    | `/api/patients/{id}/status`     | Admin-only: Update patient status |
| GET    | `/api/patients/statuses`        | Get all possible statuses         |

---

## 🗃️ Database Schema (Patient Table)

| Field       | Type     |
|-------------|----------|
| id          | UUID     |
| firstName   | String   |
| middleName  | String   |
| lastName    | String   |
| dob         | Date     |
| country     | String   |
| state       | String   |
| city        | String   |
| street      | String   |
| aptUnit     | String   |
| postalCode  | String   |
| status      | Enum     |

---

## 🔍 Search + Status Update UI

- Admin can search by name or postal code
- Inline dropdown available to change patient status
- Enum values fetched from backend (`/statuses`)

---

## 🧼 Submission Guidelines

- ✅ Project runs locally with frontend & backend
- ✅ README includes setup, features, and API docs
- ✅ GitHub repo clean and organized
- ✅ Includes authentication and protected routes
- ✅ All code follows clean practices

---
## 📬 Contact

If you have any questions:

📧 Email: [Vidudhala.chaitu@gmail.com]  
🔗 GitHub: [github.com/chaitu-1998](https://github.com/chaitu-1998)

---

> Built️ by Chaitanya Vidudhala
