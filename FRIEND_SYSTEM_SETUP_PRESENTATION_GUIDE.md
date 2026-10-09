# 🚀 Complete Setup Guide: Running Nalanda College ERP on Friend's Laptop
## (Major Project Presentation Deployment Manual)

> **🎯 Objective:** Is guide ko follow karke aap apne dost ke kisi bhi laptop/computer par apna pura **Smart Campus ERP** project 5–10 minute ke andar run kar sakte hain, jisme **aapka pura live MongoDB Atlas database, students, teachers, attendance aur settings** 100% waise hi aayenge jaise aapke system me hain.

---

## 📑 Quick Index
1. [🧠 Sabse Pehli Baat: MongoDB Data Kaise Aayega? (Important)](#1--sabse-pehli-baat-mongodb-data-kaise-aayega-important)
2. [💻 Dost Ke Laptop Me Kya-Kya Install Hona Chahiye?](#2--dost-ke-laptop-me-kya-kya-install-hona-chahiye)
3. [🌐 CRITICAL STEP: MongoDB Atlas me IP Access On Karna (Must Do)](#3--critical-step-mongodb-atlas-me-ip-access-on-karna-must-do)
4. [📥 Step-by-Step Setup: Code Clone Se Run Karne Tak](#4--step-by-step-setup-code-clone-se-run-karne-tak)
5. [🔑 Exact `.env` File Copy-Paste Content](#5--exact-env-file-copy-paste-content)
6. [▶️ Servers Run Karne Ka Tareeqa (Dual Terminal)](#6--servers-run-karne-ka-tareeqa-dual-terminal)
7. [🔐 Presentation Demo Login Credentials (Ready Reference)](#7--presentation-demo-login-credentials-ready-reference)
8. [⚠️ Presentation Day Troubleshooting & Common Errors](#8--presentation-day-troubleshooting--common-errors)

---

## 1. 🧠 Sabse Pehli Baat: MongoDB Data Kaise Aayega? (Important)

Aapka database **Local MongoDB me nahi**, balki **MongoDB Atlas Cloud (Online Server)** par hosted hai:
`mongodb+srv://mdhuzaifsh786_db_user:...@attendance-management.rcryqdu.mongodb.net/AttendanceSystem`

### Iska Matlab:
- ❌ Dost ke laptop me **MongoDB install karne ki koi zaroorat nahi hai**.
- ❌ Koi `.json` ya database export/import (dump) karne ki zaroorat nahi hai.
- ✅ Jaise hi dost ke system me backend run hoga, woh seedhe **Cloud Database** se connect ho jayega.
- ✅ Aapka saara purana data — **Principal/Coordinator profile, Admin account, Students list, Teachers list, Attendance records, Routine, aur Cloudinary images** — sab dost ke laptop par automatically dikhega!

---

## 2. 💻 Dost Ke Laptop Me Kya-Kya Install Hona Chahiye?

Dost ke system me sirf yeh **3 cheezein** honi chahiye:

| S.No | Software | Requirement | Download Link / Note |
| :--- | :--- | :--- | :--- |
| **1** | **Node.js** | **v18 ya v20 (LTS)** *(Most Important)* | [nodejs.org](https://nodejs.org/) (Download LTS version) |
| **2** | **Git** | Code clone karne ke liye | [git-scm.com](https://git-scm.com/) (Ya direct ZIP download kar sakte hain) |
| **3** | **Web Browser** | Chrome, Brave, ya Edge | Modern browser for UI presentation |
| *(Optional)* | **VS Code** | Code dekhne aur run karne ke liye | [code.visualstudio.com](https://code.visualstudio.com/) |

### Verify Kaise Karein (Dost ke Command Prompt / Terminal me):
```bash
node -v
# Output aana chahiye: v18.x.x ya v20.x.x

npm -v
# Output aana chahiye: 9.x.x ya 10.x.x

git --version
# Output: git version 2.x.x
```

---

## 3. 🌐 CRITICAL STEP: MongoDB Atlas me IP Access On Karna (Must Do)

> ⚠️ **MOST IMPORTANT WARNING:** Agar aapne ye step nahi kiya, toh dost ke laptop par internet alag hone ki wajah se error aayega: `MongooseServerSelectionError: connection timed out`.

Presentation se pehle apne phone ya laptop par yeh ek baar check kar lein:

1. **MongoDB Atlas** me login karein ([cloud.mongodb.com](https://cloud.mongodb.com/)).
2. Left menu me **"Network Access"** par click karein.
3. Check karein ki **`0.0.0.0/0` (Allow access from anywhere)** added hai ya nahi.
4. Agar nahi hai, toh:
   - Click **`Add IP Address`**
   - Click **`Allow Access from Anywhere`** (ye auto `0.0.0.0/0` daal dega)
   - Click **`Confirm`** (1 minute me active ho jata hai).
5. Ab dost ka laptop chahe kisi bhi Wi-Fi ya phone hotspot se connected ho, database 100% connect hoga!

---

## 4. 📥 Step-by-Step Setup: Code Clone Se Run Karne Tak

Dost ke laptop par Terminal / Command Prompt open karein aur yeh steps follow karein:

### Step 4.1: Project Clone Karein
```bash
# Apne pasandida folder me jayein (jaise Desktop)
cd Desktop

# GitHub se project clone karein
git clone https://github.com/MdHuzaifa018/Attendance-Management.git

# Project folder ke andar jayein
cd Attendance-Management
```
*(Agar dost ke system me Git nahi hai, toh seedhe GitHub page par jaakar **Code -> Download ZIP** karke extract kar lein).*

---

### Step 4.2: Backend Dependencies Install Karein
```bash
# Backend directory me jayein
cd backend

# Saare backend packages install karein
npm install
```

---

### Step 4.3: Backend ke andar `.env` File Banayein (Sabse Zaroori)
GitHub par security reasons se `.env` upload nahi hoti, isliye dost ke laptop me `backend/` folder ke andar ek nayi file banani hogi jiska naam hoga:  
👉 **`.env`**

File ka content niche Section 5 se copy karein.

---

### Step 4.4: Frontend Dependencies Install Karein
Ek nayi terminal window kholein ya backend se bahar aakar:
```bash
# Root folder se frontend me jayein
cd ../frontend

# Saare frontend packages install karein
npm install
```

---

## 5. 🔑 Exact `.env` File Copy-Paste Content

Dost ke laptop me path:  
`Attendance-Management/backend/.env`

Is file me ye exact code paste kar dein:

```env
PORT = 5000
MONGO_URI = mongodb+srv://mdhuzaifsh786_db_user:P6UEAKp9ByK4DOj0@attendance-management.rcryqdu.mongodb.net/AttendanceSystem
JWT_SECRET = 252cf55310dab2a7de529bf389f24eab88f1b78845e93dd84c798f8b916451b3
CLIENT_URL=http://localhost:5173

# Cloudinary Media Configuration
CLOUDINARY_CLOUD_NAME=frctjw7s
CLOUDINARY_API_KEY=325544494659798
CLOUDINARY_API_SECRET=PHo7So_MFqT2a7YpWoulVf4obeI
```

*(Note: Frontend ke liye alag se `.env` ki zaroorat nahi hai, woh automatically `http://localhost:5000/api` se connect ho jata hai).*

---

## 6. ▶️ Servers Run Karne Ka Tareeqa (Dual Terminal)

Dost ke system me **2 Terminal windows** open karni hain:

### 🟢 Terminal 1: Backend Server (Port 5000)
```bash
cd Attendance-Management/backend
npm run dev
```
**Success Screen Output:**
```
[nodemon] starting `node server.js`
Connected to MongoDB Atlas: AttendanceSystem
Server running on port: 5000
```
*(Jab tak `Connected to MongoDB Atlas` na dikhe, aage na badhein).*

---

### 🟢 Terminal 2: Frontend Server (Port 5173)
```bash
cd Attendance-Management/frontend
npm run dev
```
**Success Screen Output:**
```
  VITE v8.2.2  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 🌐 Browser Me Open Karein:
Chrome ya Edge browser open karein aur URL dalein:  
👉 **`http://localhost:5173/`**

Aapke samne:
1. Sabse pehle **Nalanda College Institutional Gateway** khulega (Principal Mam, Coordinators & Overview).
2. **"ACCESS ERP PORTAL"** button dabate hi aapka main Smart Campus ERP khul jayega (`http://localhost:5173/portal`).

---

## 7. 🔐 Presentation Demo Login Credentials (Ready Reference)

Presentation me Sir ya External Examiner ke samne live login dikhane ke liye yeh credentials use karein:

### 🛡️ 1. Super Admin Account (Full System Control)
- **Role:** Administrator
- **Email:** `admin@nalanda.edu`
- **Password:** `Admin@1234`
- **Kya Dikhana Hai:**
  - Complete Analytics Dashboard & Live Attendance %
  - Teacher Management & Subject Assignment
  - Student Directory & Promotions (BCA-I se BCA-II)
  - Semester Routine Management
  - Institutional Settings (College Logo, Admin Password Manager)

---

### 👨‍🏫 2. Faculty / Teacher Account (Lecture Attendance)
- **Role:** Teacher (HOD / Associate Professor)
- **Email:** `rajesh@nalanda.edu` *(ya `sunita@nalanda.edu` / `anita@nalanda.edu`)*
- **Password:** `Teacher@1234`
- **Kya Dikhana Hai:**
  - One-Tap Attendance Marking (Present / Absent)
  - Date-wise lecture logs
  - Class-wise student eligibility status

---

### 🎓 3. Student Account (75% Tracker & Digital ID)
- **Role:** Student
- **Email:** `24BCA001@nalanda.edu` *(ya database me jo registered roll no email hai)*
- **Password:** `Student@1234`
- **Kya Dikhana Hai:**
  - Live 75% Attendance Progress Ring
  - "Classes required to reach 75%" Auto-Calculator
  - Digital Student Identity Card (Modal with photo)
  - Daily Semester Routine

---

## 8. ⚠️ Presentation Day Troubleshooting & Common Errors

Agar dost ke laptop par koi achanak issue aaye, toh uska instant solution yeh hai:

### Issue 1: Windows PowerShell Execution Policy Error
**Error:** `npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.`  
**Instant Solution:**
Dost ke system me **PowerShell** ki jagah standard **Command Prompt (cmd.exe)** use karein, ya fir PowerShell me yeh run karein:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

### Issue 2: Port 5000 ya 5173 Already In Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`  
**Instant Solution:**
Purana running node process kill karein:
- **Windows (cmd):**
  ```cmd
  taskkill /F /IM node.exe
  ```
- Fir dubara `npm run dev` chala dein.

---

### Issue 3: College Wi-Fi Firewall Block Kar Raha Hai
Agar college ke Wi-Fi par MongoDB connect na ho:  
**Instant Solution:**  
Dost ke laptop ko **apne Mobile Hotspot** se connect karein. 4G/5G mobile hotspot par Atlas connection 100% super-fast connect hota hai.

---

### Issue 4: Offline Emergency Backup (Agar Internet Bilkul Na Ho)
Agar presentation hall me internet 0% ho:
- Apne phone ka hotspot on rakhein chahe bina recharge ho, local network communication chalu rahegi.
- Ya fir Presentation se pehle ek baar room par chala kar browser me saare tabs open karke test kar lein.

---

## 📋 2-Minute Pre-Presentation Checklist
- [ ] Dost ke laptop me Node.js installed hai (`node -v`).
- [ ] Repo cloned hai (`Attendance-Management`).
- [ ] `backend/.env` file properly created hai with MongoDB Atlas URI.
- [ ] `backend` me `npm install` ho chuka hai.
- [ ] `frontend` me `npm install` ho chuka hai.
- [ ] Phone Hotspot ready hai (Atlas connection ke liye).
- [ ] `admin@nalanda.edu` / `Admin@1234` se ek baar login test kar liya hai.

---
**Made with ❤️ for Nalanda College Major Project Presentation**  
*Department of Computer Applications • BCA Batch 2024–27*
