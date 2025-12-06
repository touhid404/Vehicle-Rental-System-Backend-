# Vehicle Rental System – Backend

###  Live API URL  
> **https://vehicle-rental-system-backend.vercel.app**  

---

## Overview

The **Vehicle Rental System** is a backend application built using **Express.js**, **TypeScript**, and **PostgreSQL**.  
It offers secure user authentication, vehicle management, booking operations, and an automated cron job to mark overdue rentals as returned.

This backend is designed using clean modular architecture for scalability and production readiness.

---

## Features

### User Management
- User Registration  
- Secure Login with **JWT**  
- Role-based Access (Admin & Customer)

### Vehicle Management
- Admin can create New Vehicle  
- Update Vehicle (with optional fields)  
- Delete Vehicle  
- View Vehicle List  
### Booking System
- Create Booking  
- Customer: Cancel Booking (before start date)  
- Admin: Mark Booking as Returned  
- Auto-mark overdue bookings as **returned** (via Cron Job)  

###  System Features
- Clean Routes -> Controller -> Service 
- Secure Password Hashing  
- Type-safe codebase (TypeScript)  
- PostgreSQL Relational Design  
- Cron job for background automated booking updates  

---

##  Technology Stack

| Category | Technology |
|---------|------------|
| Language | **TypeScript** |
| Framework | **Express.js** |
| Database | **PostgreSQL (pg)** |
| Auth | **JWT** |
| Task Scheduler | **node-cron** |
| Security | bcrypt |
| Config | dotenv |

---



##  Project Setup Guide

Follow these steps to run the **Vehicle Rental System Backend** on your local pc/laptop.

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/touhid404/Vehicle-Rental-System-Backend-.git
cd Vehicle-Rental-System-Backend
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Create Environment Variables**

Create a `.env` file in the root directory and add your environment values:

```env
PORT=5000
DATABASE_URL=your_postgres_connection_url
JWT_SECRET=your_jwt_secret
```

### **Step 4: Start the Development Server**

```bash
npm run dev
```

And your are ready to use .


