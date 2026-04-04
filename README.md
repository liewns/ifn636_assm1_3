# Travel Expense Tracker

A full-stack MERN web application developed for **IFN636 Software Life Cycle Management**.  
This project allows users to create trips, record travel expenses, manage budgets, and monitor spending. It also includes an admin panel for managing users, trips, and expenses.

---

## Project Overview

The Travel Expense Tracker was developed as part of the IFN636 assignment to extend a starter MERN application into a practical real-world system. The application helps users organise their travel plans and expenses in one place, while also providing administrative controls for platform management.

The project also includes automated testing, CI/CD pipeline integration, and deployment to an AWS EC2 instance using GitHub Actions, PM2, and Nginx.

---

## Features

### User Features
- User registration and login with JWT authentication
- Create, view, update, and delete trips
- Assign a budget to each trip
- Create, view, update, and delete expenses
- Categorise expenses into:
  - Accommodation
  - Transport
  - Food
  - Activities
  - Shopping
  - Other
- Track spending across trips
- Manage travel records in a dashboard interface

### Admin Features
- View total users, trips, expenses, and total spending
- Access an admin dashboard
- Manage users
- Manage trips
- Manage expenses
- Delete users, trips, and expenses with confirmation prompts

---

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Testing
- Mocha
- Chai
- Sinon

### Deployment / DevOps
- GitHub Actions
- AWS EC2
- PM2
- Nginx

---

## Project Structure

```bash
.
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── test
│   └── server.js
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── context
│       ├── pages
│       └── axiosConfig.js
├── .github
│   └── workflows
│       └── ci.yml
├── package.json
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/liewns/ifn636_assm1_3.git
cd ifn636_assm1_3
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend` folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

---

## Running the Application Locally

From the project root, run:

```bash
npm start
```

This starts:
- the backend on port `5001`
- the frontend on port `3000`

---

## Running Tests

To run the backend tests:

```bash
cd backend
npm test
```

The test suite includes controller tests for:
- Trip functionality
- Expense functionality

---

## CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and deployment.

The workflow:
- triggers on push to `main`
- installs backend and frontend dependencies
- runs backend tests
- builds the frontend
- uses GitHub secrets for environment configuration
- deploys to AWS EC2 through a self-hosted runner
- manages processes using PM2

---

## Deployment

The application is deployed on **AWS EC2**.

Deployment components include:
- **PM2** for managing backend and frontend services
- **Nginx** for serving and routing the deployed application
- **GitHub Actions** for automated CI/CD workflow execution

---

## Public URL

The deployed application can be accessed at:

**http://3.25.95.6:3000**

---

## Demo Access

No pre-created credentials are required. A new user account can be registered directly through the application.

If admin access is also required, use:

**Admin Email:** `liewnasya@outlook.com`  
**Admin Password:** `liewnasya`

---

## Author

**Nasya Sze Yuen Liew**  
IFN636 Software Life Cycle Management
