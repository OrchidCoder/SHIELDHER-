# SHIELDHER -- Smart Women Safety & Emergency Response Platform

SHIELDHER is a women-safety web application designed to help users
manage emergency incidents, share their current location, maintain
trusted contacts, and define safe zones. It combines a React-based
frontend, a Node.js/Express backend, and MongoDB Atlas.

> **Project status:** Core application modules have been implemented.
> AWS production deployment is in progress. Emergency contact
> notifications are currently simulated; the application does **not**
> send real SMS or WhatsApp messages or contact emergency services.

## Table of Contents

-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [Project Structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Getting Started](#getting-started)
-   [Environment Configuration](#environment-configuration)
-   [Run the Application](#run-the-application)
-   [Health Check](#health-check)
-   [How the Main Modules Work](#how-the-main-modules-work)
-   [AWS Deployment](#aws-deployment)
-   [Security Notes](#security-notes)
-   [Current Limitations](#current-limitations)
-   [Future Improvements](#future-improvements)

## Features

-   **Authentication:** User registration and login.
-   **SOS incident management:** Start/cancel the SOS flow and create
    emergency incident records.
-   **GPS location:** Obtain the user's location through browser
    geolocation where permission is granted.
-   **Trusted contacts:** Create, view, and manage trusted contacts.
-   **Incident history:** View and manage recorded incidents, including
    resolving incidents.
-   **Safe zones:** Create and manage saved safe locations.
-   **Safe-zone monitoring:** Browser GPS monitoring with distance-based
    boundary checks.
-   **Safe-zone event history:** Store safe-zone monitoring events in
    MongoDB.
-   **Emergency notification records:** Create simulated notification
    records for trusted contacts during the SOS flow.
-   **Dashboard:** Web interface for interacting with the application's
    modules.

## Technology Stack

  -----------------------------------------------------------------------
  Layer                               Technology
  ----------------------------------- -----------------------------------
  Frontend                            React, Vite, JavaScript

  Backend                             Node.js, Express

  Database                            MongoDB Atlas, Mongoose

  Authentication                      JSON Web Token (JWT), bcryptjs

  Security and middleware             Helmet, CORS, express-rate-limit

  Cloud / deployment target           AWS (EC2, EBS, VPC, S3 planned for
                                      frontend hosting)

  Web server / reverse proxy          Nginx planned for production
                                      routing
  -----------------------------------------------------------------------

## Project Structure

The main project directory is `SHIELDHER`.

``` text
SHIELDHER/
├── apps/
│   └── admin/                 # React + Vite frontend
├── backend/                   # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Database and application configuration
│   │   ├── models/             # Mongoose models
│   │   ├── controllers/        # Request handlers
│   │   └── routes/             # API routes
│   ├── package.json
│   └── server.js
└── README.md
```

The exact contents of `backend/src` may include additional modules as
development continues.

## Prerequisites

Install the following before running the project:

-   Node.js (the project has been prepared with Node.js 24 in the
    deployment environment)
-   npm
-   MongoDB Atlas account and a database connection URI
-   A modern browser with location services enabled for GPS-based
    features

## Getting Started

1.  Clone or copy this repository to your computer.

2.  Open the project root (`SHIELDHER`) in your terminal or editor.

3.  Install backend dependencies:

    ``` bash
    npm install --prefix backend
    ```

4.  Install frontend dependencies:

    ``` bash
    npm install --prefix apps/admin
    ```

5.  Create the backend environment file at `backend/.env` and configure
    the variables listed below.

6.  Start the backend and frontend in separate terminals.

> If the repository uses a root-level npm workspace or lockfile, follow
> the dependency installation instructions associated with that
> repository. The commands above assume each application has its own
> `package.json`.

## Environment Configuration

Create `backend/.env`:

``` dotenv
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_connection_uri
JWT_SECRET=your_long_random_secret
INSTANCE_ID=local-development
```

Replace the placeholder values locally. Do not commit `.env` files or
share their contents.

Generate a strong JWT secret using a secure random generator. For
example, on Linux:

``` bash
openssl rand -hex 32
```

The backend requires a valid `MONGODB_URI` and `JWT_SECRET`.
`CLIENT_URL` is used for the allowed frontend origin; update it when the
frontend is hosted at a different origin. `INSTANCE_ID` is used to
identify the running instance in health information.

## Run the Application

Run these commands from the project root.

### 1. Start the backend

``` bash
npm run dev --prefix backend
```

The backend is configured to use port `5000` by default.

### 2. Start the frontend

Open a second terminal:

``` bash
npm run dev --prefix apps/admin
```

Vite normally serves the frontend at:

``` text
http://localhost:5173
```

Open that address in your browser.

### 3. Production frontend build

To create the frontend production build:

``` bash
npm run build --prefix apps/admin
```

The generated build is normally placed in the frontend's `dist`
directory.

## Health Check

When the backend is running and its database connection succeeds, open:

``` text
http://localhost:5000/api/v1/health
```

The health endpoint reports the backend service status and runtime
information.

## How the Main Modules Work

### SOS and incidents

The SOS flow creates an incident record in the backend. The application
also creates simulated notification records for configured trusted
contacts. These records are not proof that a message was delivered.

### GPS and safe zones

The frontend uses the browser Geolocation API. Location access requires
user permission and may require a secure context (HTTPS) outside
localhost. Safe-zone monitoring compares the user's reported coordinates
with saved zone boundaries and records events.

### Trusted contacts and history

Trusted contacts and incident history are managed through backend API
routes and persisted in MongoDB.

## AWS Deployment

The intended cloud deployment uses AWS services:

-   **IAM:** Identity and access management.
-   **VPC:** Network environment for the server.
-   **EC2:** Linux virtual machine for the backend.
-   **EBS:** Block storage attached to EC2.
-   **S3:** Planned hosting for the built frontend.

The backend has previously been copied to `/var/www/shieldher` on an
Amazon Linux EC2 instance, and production Node.js dependencies have been
installed there. The live production service, Nginx reverse proxy, and
S3 frontend hosting must be verified and completed before describing the
application as publicly deployed.

A typical deployment sequence is:

1.  Configure the production environment variables securely on EC2.
2.  Verify that EC2 can connect to MongoDB Atlas.
3.  Test the backend health endpoint locally on the EC2 host.
4.  Configure a `systemd` service to keep the backend running.
5.  Configure Nginx as a reverse proxy.
6.  Build the frontend and upload its build output to S3.
7.  Configure the frontend API base URL and CORS origin.
8.  Test the deployed application end to end.

Do not expose the backend port directly to the public internet. Prefer
routing HTTP/HTTPS traffic through Nginx and restrict SSH access to
trusted IP addresses.

## Security Notes

-   Never commit `.env`, database credentials, JWT secrets, PEM private
    keys, or AWS access keys.
-   Use least-privilege IAM roles instead of long-lived AWS access keys
    on EC2.
-   Keep SSH restricted to trusted source IP addresses.
-   Use HTTPS for production, especially for browser geolocation and
    authentication.
-   Treat browser GPS data as user-device data that may be unavailable,
    inaccurate, or permission-denied.
-   Do not represent simulated notification records as real emergency
    communication.
-   This project is a safety-support tool and is not a replacement for
    local emergency services.

## Current Limitations

-   SMS and WhatsApp delivery are not implemented; notification records
    are simulated.
-   Automatic police/emergency-service dispatch is not implemented.
-   Production AWS deployment is still being completed and must be
    tested before public use.
-   GPS availability and accuracy depend on the user's device, browser,
    permissions, and network conditions.
-   HTTPS and a production domain/certificate need to be configured for
    a secure public deployment.

## Future Improvements

-   Integrate a verified SMS/WhatsApp provider with consent, delivery
    tracking, and secure credential handling.
-   Add optional live location sharing with explicit user control.
-   Add push notifications and delivery status.
-   Add audit logging, monitoring, backups, and automated tests.
-   Complete HTTPS deployment and production security review.
-   Improve accessibility, responsive design, and usability testing.

------------------------------------------------------------------------

## Academic Project

**Project:** SHIELDHER -- Smart Women Safety & Emergency Response
Platform\
**Domain:** Web Development, Cloud Computing, and Emergency Response\
**Purpose:** Academic capstone project

For setup or deployment questions, review the project scripts in the
frontend and backend `package.json` files and keep all production
secrets outside source control.
