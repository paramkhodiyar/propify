# Propify

**Propify** is a full-stack real estate platform built with a modern RBAC (Role-Based Access Control) system. It supports property listings, agent onboarding workflows, admin moderation, user inquiries, and integrates an upcoming AI-powered price prediction system called **MayaAI**.

The platform is designed with a scalable backend architecture, multi-role dashboards, and a moderation-driven listing and user upgrade workflow.

---

## Features

- Role-Based Access Control (User, Agent, Admin)
- Authentication & Authorization (Session / Token based)
- Property Listings with Admin Approval Flow
- Agent Upgrade Request & Approval System
- Saved Properties (Watchlist)
- Inquiry / Chat System between users and agents
- Admin Moderation Dashboard
- Notification System
- Planned AI Price Prediction System (MayaAI)

---

## Tech Stack

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,tailwind,nodejs,express,prisma,postgres,python,fastapi,sklearn,pandas" alt="Tech Stack" />
  </a>
</p>

### Frontend
- **Next.js**
- **Tailwind CSS**
- **Framer Motion**

### Backend
- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL / MySQL**
- **RBAC Middleware**

### AI (Planned)
- **Python**
- **FastAPI**
- **Scikit-learn**
- **Pandas**

---

## Deployed Services

| Service | URL |
|--------|-----|
| Frontend (Next.js) |  |
| Backend API |  |
| MayaAI (ML API) |  |

---

## RBAC Roles

- **User**: Can browse listings, save properties, send inquiries, request agent upgrade.
- **Agent**: Can create and manage property listings (after approval).
- **Admin**: Can approve/reject users and listings, manage platform content.

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/register` | Register a new user account | ❌ |
| POST | `/login` | Authenticate a user and return a token/cookie | ❌ |
| POST | `/logout` | Clear the authentication session/cookie | ❌ |
| GET | `/me` | Get the currently logged-in user's profile | ✅ |

---

### Users (`/api/users`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/` | Retrieve all registered users (Admin only) | ✅ |
| PUT | `/:id` | Update user details (name, avatar, role) | ✅ |
| DELETE | `/:id` | Permanently delete a user account | ✅ |
| POST | `/:id/upgrade` | Request role upgrade (User → Agent) | ✅ |
| POST | `/save` | Toggle save/unsave property to watchlist | ✅ |
| GET | `/profilePosts` | Get user's own listings and saved properties | ✅ |
| GET | `/notification` | Get count of unread notifications/chats | ✅ |

---

### Listings (`/api/listings`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/` | Retrieve all public property listings (with filters) | ❌ |
| GET | `/my-listings` | Get listings created by logged-in agent | ✅ |
| GET | `/:id` | Get detailed information for a property | ❌ |
| POST | `/` | Create a new property listing (Agent/Admin only) | ✅ |
| PUT | `/:id` | Update an existing property listing | ✅ |
| DELETE | `/:id` | Delete a property listing | ✅ |

---

### Admin (`/api/admin`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/pending-users` | Get users requesting role upgrades | ✅ |
| POST | `/users/:id/approve` | Approve user upgrade request | ✅ |
| POST | `/users/:id/reject` | Reject user upgrade request | ✅ |
| GET | `/pending-listings` | Get listings awaiting approval | ✅ |
| GET | `/all-listings` | Get all listings (including inactive/pending) | ✅ |
| POST | `/listings/:id/approve` | Approve a property listing | ✅ |

---

### Inquiries (`/api/inquiries`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/` | Create a new inquiry / chat message | ✅ |
| GET | `/` | Retrieve all inquiries/chats for logged-in user | ✅ |

---

### Contact (`/api/contact`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/` | Submit a contact form message to admins | ❌ |

---

## MayaAI — AI Price Prediction System (Planned)

MayaAI is an upcoming AI-powered microservice that will:

- Predict approximate property prices based on:
  - Location
  - Area (sqft)
  - BHK
  - Bathrooms
  - Property type
- Be implemented as a **Python FastAPI microservice**
- Use a trained Machine Learning regression model
- Be consumed by the main Propify backend via HTTP

This will allow:

- Visitors to estimate property prices
- Users to validate listing prices
- Agents to price properties better

---

## Project Vision

Propify is designed to evolve from:

> A normal listing platform  
into  
> An intelligent real estate decision platform.

---

## Disclaimer

This project is currently intended for development, learning, and demonstration purposes.
