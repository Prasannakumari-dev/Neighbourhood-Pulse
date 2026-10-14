# Neighbourhood Pulse
### A Full-Stack Neighbourhood Event and Community Reporting Platform

Neighbourhood Pulse is a full-stack web application designed to support community engagement through neighbourhood event management, community issue reporting, and interactive location-based visualization. The platform provides a centralized interface for organizing local activities and exploring reported community issues.

## Overview

Managing local events and communicating neighbourhood issues can be challenging when information is scattered across different platforms. Neighbourhood Pulse brings these activities together in a single web application, enabling users to manage events, submit community reports, filter events by date, and explore location-based information through an interactive map.

## Key Features

- **Event Management:** Create, view, update, and delete neighbourhood events.
- **Date-Based Filtering:** Filter events by upcoming dates, past events, or a selected date.
- **Community Issue Reporting:** Submit and manage reports about local neighbourhood issues.
- **Interactive Map Visualization:** Display events and community reports that contain valid geographical coordinates.
- **Map-Based Location Selection:** Select geographical coordinates when creating events and community reports.
- **RESTful API:** Use backend endpoints to manage event and community report data.
- **Database Integration:** Store and retrieve application data using MongoDB.
- **Component-Based Interface:** Organize the frontend into reusable React components.

## Technology Stack

| Technology | Application |
|---|---|
| React.js | Frontend development |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | Server and REST API development |
| MongoDB | NoSQL database |
| Mongoose | Database modeling and operations |
| Axios | HTTP communication between frontend and backend |
| Leaflet | Interactive mapping |
| React Leaflet | Map integration with React |
| Git and GitHub | Version control and source code management |

## System Architecture

The application follows a client-server architecture.

1. **Frontend:** The React application provides the user interface for event management, community reporting, date filtering, and map visualization.
2. **Backend:** The Node.js and Express server exposes REST API endpoints and processes client requests.
3. **Database:** MongoDB stores event and community report records, accessed through Mongoose.
4. **Map Integration:** Leaflet and React Leaflet visualize records that include geographical coordinates.

## Project Structure

```text
Neighbourhood-Pulse/
├── nodeapp/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── reactapp/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

Ensure that the following are installed:

- Node.js and npm
- MongoDB, running locally or through a configured database service
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Prasannakumari-dev/Neighbourhood-Pulse.git
cd Neighbourhood-Pulse
```

### 2. Configure and Start the Backend

Open a terminal in the project directory and execute:

```bash
cd nodeapp
npm install
node index.js
```

The backend is configured to run at:

`http://localhost:8080`

The default local MongoDB connection is:

`mongodb://127.0.0.1:27017/neighbourhood_events`

Ensure MongoDB is running and update the database configuration if required.

### 3. Start the Frontend

Open a second terminal in the project directory and execute:

```bash
cd reactapp
npm install
npm start
```

The React development server is typically available at:

`http://localhost:3000`

### 4. Access the Application

Open the frontend URL in a browser after starting both the backend and frontend servers.

## API Reference

### Events

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Retrieve events |
| POST | `/api/events` | Create a new event |
| PUT | `/api/events/:id` | Update an existing event |
| DELETE | `/api/events/:id` | Delete an event |

### Community Reports

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports` | Retrieve community reports |
| POST | `/api/reports` | Submit a community report |

## Project Objectives

- Simplify the organization and management of neighbourhood events.
- Provide a centralized way to record and manage community issues.
- Improve access to local information through interactive maps.
- Demonstrate full-stack application development using React, Node.js, Express, and MongoDB.

## Future Enhancements

- User authentication and role-based access control.
- Event reminders and notification functionality.
- Search and category-based filtering for community reports.
- Deployment to a cloud hosting platform.
- Automated testing and enhanced API validation.

## Author

**Prasannakumari E**

B.E. Electrical and Electronics Engineering

GitHub: [Prasannakumari-dev](https://github.com/Prasannakumari-dev)

## Repository

[Neighbourhood Pulse — GitHub Repository](https://github.com/Prasannakumari-dev/Neighbourhood-Pulse)

