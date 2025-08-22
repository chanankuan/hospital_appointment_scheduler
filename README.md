# Hospital Appointment Scheduler

## Table of Content

- [Overview](#overview)
- [Launching the Application](#launching-the-application)
- [API Documentation](#api-documentation)

## Overview

The **Hospital Appointment Scheduler** is a system designed to simplify the
process of booking medical appointments.  
Patients can specify their symptoms or required specialization (e.g.,
_cardiology_, _surgery_), and the system will automatically:

- Match them with an available doctor in the required specialization.
- Find the **nearest available appointment slot** based on doctor availability
  and workload.
- Ensure efficient **time management** by considering appointment duration and
  patient load.

This project aims to reduce waiting times, improve scheduling efficiency, and
enhance the overall patient experience in hospitals or clinics.

## Launching the Application

To run the **Hospital Appointment Scheduler** locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/chanankuan/hospital_appointment_scheduler.git
cd hospital-appointment-scheduler
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```env
PORT=3000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
SESSION_SECRET=yourSecretHere
```

### 4. Start the application

#### 1. Build and start the containers

```bash
docker-compose up --build
```

#### 2. Access the services:

- App: `http://localhost:3000`
- Redis: `localhost:6379`

The Docker setup automatically runs your Node.js app and Redis instance. The app
is mounted with live reload, so changes in your local files are reflected in the
container.

#### 3. Stop the containers:

```bash
docker-compose down
```

## API Documentation

All API endpoints are documented using **Swagger (OpenAPI 3.0)**.  
You can access the interactive API documentation through the Swagger UI:

http://localhost:3000/api-docs

### Features

- View all available endpoints, request/response schemas, and example data.
- Test API endpoints directly from the browser.
- See detailed error responses including:
  - `400 Bad Request` for validation errors
  - `401 Unauthorized` for authentication issues
  - `409 Conflict` for duplicate entries
  - `500 Internal Server Error` for unexpected failures

> The Swagger UI is automatically served with the application. Make sure your
> server is running to access it.

### Example

For example, the **Register User** endpoint provides request body validation and
detailed responses:

- **POST** `/api/auth/register`
- **Request Body**: `first_name`, `last_name`, `email`, `phone_number`,
  `password`
- **Responses**:
  - `201 Created` – Successful registration
  - `400 Bad Request` – Validation failed
  - `409 Conflict` – Email or phone number already in use
  - `500 Internal Server Error` – Server error
