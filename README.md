# 🌍 LocalXplore
### Discover Local Experiences. Connect with Local Guides.

**LocalXplore** is a full-stack web application that connects tourists with local guides, allowing users to discover, explore, and book authentic local travel experiences.

The platform provides dedicated dashboards for **Tourists, Guides, and Administrators**, with features such as experience discovery, booking management, reviews, favorites, location-based exploration, and personalized itinerary planning.

This project was developed as a **Semester 1 Full-Stack Web Development Project**.

---

## 📌 Project Overview

Travelers often face difficulties finding authentic local experiences and connecting directly with local guides.

LocalXplore addresses this challenge by providing a centralized platform where:

- 🌍 Tourists can discover and book local experiences.
- 🧭 Guides can create and manage travel experiences.
- 🛡️ Administrators can manage users and approve experiences.
- 📍 Travelers can discover nearby attractions using an interactive map.
- 📅 Tourists can create personalized travel itineraries.

The platform focuses on making local travel discovery more accessible, organized, and convenient.

---

## ✨ Key Features

### 👤 Tourist Module

- Tourist registration and login
- Browse available travel experiences
- Search, filter, and sort experiences
- Explore experiences by destination
- View detailed experience information
- Book local experiences
- View and cancel bookings
- Save favorite experiences
- Submit reviews for eligible bookings
- Manage personal profile
- Create and manage personalized travel itineraries

### 🧭 Guide Module

- Guide registration and login
- Dedicated guide dashboard
- Create new travel experiences
- Edit and manage existing experiences
- View booking requests
- Confirm or reject bookings
- Manage guide profile
- Track experience approval status

### 🛡️ Admin Module

- Secure administrator dashboard
- Approve or reject submitted experiences
- View and manage registered users
- Activate or deactivate user accounts
- View and manage platform experiences
- Activate or deactivate experiences
- Monitor platform statistics
- Control experience visibility

### 📍 Explore Near Me

- Interactive map powered by Leaflet
- OpenStreetMap integration
- Browser-based location detection
- Nearby attraction discovery
- Attraction markers and map popups
- City-based experience filtering
- Location-based exploration interface

### 📅 Manual Itinerary Builder

Tourists can organize their travel plans using the itinerary management system.

Features include:

- Create personalized itineraries
- Set itinerary names and descriptions
- Select travel start and end dates
- Add experiences to itineraries
- Organize experiences by day
- Add notes to itinerary activities
- Edit itinerary details
- Remove experiences
- Delete itineraries

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JWT, bcrypt |
| API Communication | Axios |
| Maps | Leaflet, OpenStreetMap |
| Location Services | Browser Geolocation API, Nominatim |
| Nearby Attractions | Overpass API |
| Version Control | Git, GitHub |

---

## 📁 Project Structure

```text
LocalXplore/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── experienceController.js
│   │   ├── bookingController.js
│   │   ├── favoriteController.js
│   │   ├── reviewController.js
│   │   ├── itineraryController.js
│   │   └── ...
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── experienceRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── itineraryRoutes.js
│   │   └── ...
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Tourist/
│   │   │   ├── Guide/
│   │   │   └── Admin/
│   │   │
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

**Note:** The `.env` file is used locally and must not be committed to GitHub.

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following software:

- Node.js
- npm
- MySQL Server
- Git
- A code editor such as VS Code

### 1. Clone the Repository

```bash
git clone https://github.com/tanish-coder06/LocalXplore.git
```

Navigate into the project:

```bash
cd LocalXplore
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=localxplore_db

JWT_SECRET=replace_with_a_long_random_secret
```

Replace the placeholder values with your local database credentials and a securely generated JWT secret.

### 3. Database Setup

Start your MySQL server.

Create the database:

```sql
CREATE DATABASE localxplore_db;
```

The application uses the following main tables:

| Table | Purpose |
|---|---|
| users | Stores user accounts and roles |
| experiences | Stores guide-created experiences |
| bookings | Stores tourist bookings |
| favorites | Stores saved experiences |
| reviews | Stores experience ratings and reviews |
| itineraries | Stores tourist travel plans |
| itinerary_items | Stores experiences added to itineraries |

**Important:** The database schema is not currently included in this repository. The required tables and relationships must be created before running the complete application.

### 4. Start the Backend

From the `backend` directory:

```bash
npm start
```

If the project does not define a start script, use:

```bash
node server.js
```

The backend runs at:

```text
http://localhost:5000
```

### 5. Frontend Setup

Open a second terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend typically runs at:

```text
http://localhost:5173
```

Open this address in your browser to access LocalXplore.

---

## 🔐 Authentication and Authorization

LocalXplore uses **JSON Web Tokens (JWT)** for authentication and role-based authorization.

The application supports three roles:

| Role | Access |
|---|---|
| Tourist | Bookings, favorites, reviews, itineraries, profile |
| Guide | Experience management, booking requests, profile |
| Admin | User management, experience approval, platform overview |

Protected frontend routes restrict dashboard access based on user roles.

Backend middleware also verifies JWT tokens and enforces authorization for protected API endpoints.

Passwords are handled using bcrypt-based hashing.

---

## 🔄 Experience Booking Workflow

The application follows this workflow:

1. A guide creates a travel experience.
2. The experience is submitted for administrator approval.
3. An administrator reviews and approves the experience.
4. The approved experience becomes visible to tourists.
5. A tourist selects an experience and creates a booking.
6. The guide reviews the booking request.
7. The guide confirms or rejects the booking.
8. The tourist can view the updated booking status.

This workflow connects the Tourist, Guide, and Admin modules.

---

## 🗺️ Location-Based Exploration

The Explore Near Me feature integrates mapping and location services to help tourists discover attractions.

It uses:

- **Leaflet** for interactive map rendering
- **OpenStreetMap** for map data
- **Browser Geolocation API** for detecting the user's location with permission
- **Overpass API** for retrieving nearby attractions
- **Nominatim** for reverse geocoding

The application also displays available LocalXplore experiences with city-based filtering.

---

## 🚀 Future Scope — Semester 2

Planned enhancements include:

### 🤖 AI-Powered Itinerary Generator

Introduce intelligent itinerary recommendations based on:

- Travel destination
- Number of travel days
- Tourist interests
- Available experiences
- Travel preferences

### Additional Enhancements

- Experience image uploads
- More advanced location-based recommendations
- Enhanced itinerary optimization
- Improved booking and travel management
- Additional user experience improvements

These features are planned for future development and are not part of the current Semester 1 implementation.

---

## 🎓 Academic Project

**Project Name:** LocalXplore  
**Project Type:** Full-Stack Web Application  
**Development Phase:** Semester 1  
**Domain:** Tourism and Local Experience Marketplace

### Project Objectives

- Develop a functional full-stack tourism platform.
- Implement secure user authentication.
- Apply role-based access control.
- Build RESTful APIs.
- Integrate React with Node.js and MySQL.
- Implement real-world booking workflows.
- Provide location-based attraction discovery.
- Enable personalized travel itinerary management.

---

## 👨‍💻 Developer

**Tanish Khandelwal**

GitHub: tanish-coder06

---

## 📌 Project Status

**Semester 1:** Core application development completed.

Implemented modules include:

- Authentication and authorization
- Tourist dashboard and features
- Guide dashboard and features
- Administrator management
- Experience discovery and bookings
- Favorites and reviews
- Explore Near Me
- Manual itinerary management

**Semester 2:** AI-powered itinerary generation and additional enhancements are planned.

---

⭐ If you find this project interesting, consider starring the repository!
