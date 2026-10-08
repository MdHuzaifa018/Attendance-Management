# 🔐 Nalanda College ERP — Administrator Credentials & Password Management Guide

> **Official Reference Manual**  
> Is guide me Admin ID (Email) aur Password ko change / reset karne ke sabhi tareeqe, aur application me diye gaye new security features (Show/Hide Password toggle, Web UI Settings, CLI Script) ko detail me samjhaya gaya hai.

---

## 📌 Table of Contents
1. [Default Admin Credentials](#1-default-admin-credentials)
2. [Method 1: Web Portal se Change Karna (Recommended)](#2-method-1-web-portal-se-change-karna-recommended)
3. [Method 2: Command Line (CLI Script) se Reset Karna (Emergency Recovery)](#3-method-2-command-line-cli-script-se-reset-karna-emergency-recovery)
4. [Method 3: MongoDB Database (Atlas / Compass) se Direct Change Karna](#4-method-3-mongodb-database-atlas--compass-se-direct-change-karna)
5. [👁️ Password Show / Hide Feature (Student & Teacher Forms)](#5-password-show--hide-feature-student--teacher-forms)
6. [🛡️ Security Best Practices & FAQs](#6-security-best-practices--faqs)

---

## 1. Default Admin Credentials

System initialization ke time default Admin credentials niche diye gaye hain:

| Property | Default Value |
| :--- | :--- |
| **Admin Name** | `System Admin` |
| **Login Email / ID** | `admin@nalanda.edu` |
| **Default Password** | `Admin@1234` |
| **Role** | `admin` (Superuser) |
| **Portal URL** | `http://localhost:5173/login` |

*(Note: Production deployment se pehle apna default password zaroor change kar lein.)*

---

## 2. Method 1: Web Portal se Change Karna (Recommended)

Ab Admin Portal me **"Settings & Security"** ke andar direct credentials manager diya gaya hai.

### Step-by-Step Process:
1. Website me Admin account se login karein.
2. Sidebar me sabse niche apne profile name ya **Settings (Logo icon)** par click karein, ya URL par jayein:  
   👉 `http://localhost:5173/admin/settings`
3. Page ke top par do tabs dikhenge:
   - 🏢 **College Logo & Branding**
   - 🛡️ **Admin Account & Security (ID / Password)**
4. **"Admin Account & Security"** tab par click karein.
5. Yahan aapko yeh options milenge:
   - **Administrator Full Name:** Apna naam update karein.
   - **Admin Login Email (ID):** Apna naya login email dalein.
   - **Current Password:** Security verification ke liye apna purana password dalein.
   - **New Password:** Naya password dalein (kam se kam 6 characters).
   - **Confirm New Password:** Naye password ko re-type karein.
6. Har password field ke right side me **👁️ Eye icon (Show / Hide)** button diya gaya hai, jisse click karke aap password dekh sakte hain taaki koi typo na ho.
7. **"Update Admin Credentials"** button par click karein.
8. System credentials securely encrypt (`bcrypt`) karke update kar dega aur instant success notification show karega!

> 💡 **Tip:** Agar aapko sirf apna Name ya Email ID change karna hai aur password wahi rakhna hai, toh password fields ko khali chhod kar directly save kar sakte hain.

---

## 3. Method 2: Command Line (CLI Script) se Reset Karna (Emergency Recovery)

Agar aap kisi wajah se admin password bhul gaye hain ya portal open nahi ho raha hai, toh aap apne terminal / command prompt se 1 second me reset kar sakte hain.

Humne project ke andar ek dedicated automation script banayi hai:  
`backend/scripts/resetAdminPassword.js`

### A. Default Credentials Par Reset Karna:
Terminal (PowerShell / Command Prompt) open karein aur run karein:
```powershell
node backend/scripts/resetAdminPassword.js
```
Yeh command database ke Admin account ko instantly reset karke set kar dega:
- **Email:** `admin@nalanda.edu`
- **Password:** `Admin@1234`

### B. Custom Email aur Custom Password Set Karna:
Agar aap command line se hi apna manpasand email aur password set karna chahte hain:
```powershell
node backend/scripts/resetAdminPassword.js myadmin@nalanda.edu MySecretPass@2026
```
Output:
```text
Connecting to MongoDB...
Connected successfully.

Found Admin Account: "System Admin" (Current Email: admin@nalanda.edu)

================================================
SUCCESS! Admin Credentials Updated Successfully:
  Name:     System Admin
  Email/ID: myadmin@nalanda.edu
  Password: MySecretPass@2026
================================================
```

---

## 4. Method 3: MongoDB Database (Atlas / Compass) se Direct Change Karna

MongoDB me passwords plain text me save nahi hote, balki **bcrypt hash** format me store hote hain.

Agar aap MongoDB Compass ya MongoDB Atlas Web UI use kar rahe hain:

1. **MongoDB Compass** ya Atlas me connect karein.
2. Database open karein: `attendance_db` (ya aapke `.env` ka database).
3. Collection open karein: `users`.
4. Filter karein: `{ role: "admin" }`.
5. Email edit karne ke liye `email` field par double click karke naya email save karein.
6. Password change karne ke liye aapko bcrypt hash paste karna hoga.  
   *Example: Password `Admin@1234` ka bcrypt hash niche diya gaya hai:*  
   ```text
   $2a$10$wEkgjV8Xg898w0eXQd4Ddu5O81aYgIeGZ1hTjL5sV0bVf8R9X2k6u
   ```
   Is hash ko `password` field me paste karke **Update** dabayein.

*(Note: Is manual method se behtar **Method 1 (Portal)** ya **Method 2 (CLI Script)** use karein, jisse automatically sahi hashing ho jati hai.)*

---

## 5. 👁️ Password Show / Hide Feature (Student & Teacher Forms)

Aapki requirement ke mutabiq, sabhi modals me password field ke andar interactive **Show / Hide Eye Toggle Button** daal diya gaya hai:

### Kahan-Kahan Add Hua Hai:
1. **Edit & Add Student Modal (`StudentFormModal.jsx`):**
   - Password field ke andar eye icon button diya gaya hai.
   - Click karne par `type="password"` se `type="text"` toggle hota hai.
   - Admin student ka naya password type karte waqt aasaani se confirm kar sakta hai.
2. **Edit & Add Teacher Modal (`TeacherFormModal.jsx`):**
   - Teacher credential form me bhi password show/hide eye toggle button integrated hai.
3. **Admin Settings Security Tab (`AdminSettingsPage.jsx`):**
   - Current Password, New Password, aur Confirm Password teeno fields me separate show/hide buttons diye gaye hain.

---

## 6. 🛡️ Security Best Practices & FAQs

### Q1: Password change karne ke baad kya purana session logout hoga?
- Web portal se update karne par aapka session active rehta hai aur local cache instantly sync ho jati hai. Next time login karne par aapko naya password enter karna hoga.

### Q2: Minimum password length kya hai?
- System security policy ke mutabiq password kam se kam **6 characters** ka hona zaroori hai.

### Q3: Password database me kis format me store hota hai?
- Passwords industry-standard `bcryptjs` algorithm ke sath 10 salt rounds me hash hokar store hote hain. Plain-text password database me kabhi bhi save nahi hota.

---

*Document Created for Nalanda College ERP • Smart Campus Management*
