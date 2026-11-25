# SHIELDHER -- Smart Women Safety & Emergency Response Platform

SHIELDHER is a women-safety web application and B.Tech CSE capstone
project. It helps users manage emergency incident records, share their
current location, maintain trusted contacts, and define safe zones. The
application combines a React frontend, a Node.js/Express backend, and
MongoDB Atlas.

## Live Application & AWS Production Deployment

**Production status: deployed and accessible over HTTPS.**

- **Live Application:** [https://13-127-217-122.sslip.io](https://13-127-217-122.sslip.io)
- **AWS Production Deployment:** [https://13-127-217-122.sslip.io](https://13-127-217-122.sslip.io)
- **GitHub Repository:** [https://github.com/OrchidCoder/SHIELDHER-](https://github.com/OrchidCoder/SHIELDHER-)

The production architecture uses only these five AWS services:

- **IAM:** Identity and access management.
- **VPC:** Network environment for AWS resources.
- **EC2:** Hosts the Node.js/Express application and Nginx.
- **EBS:** Block storage attached to EC2.
- **S3:** Static frontend hosting.

MongoDB Atlas is the application's external database provider. It is not
an additional AWS service. The production web application is available
over HTTPS through the URL above. The `sslip.io` hostname depends on the
EC2 public IP; if that IP changes, the hostname and related production
configuration may need updating.

> **Emergency communication notice:** SOS activity and notification
> records are part of an academic demo. SHIELDHER does **not** send real
> SMS or WhatsApp messages and does **not** automatically contact
> police or emergency services. The application does not guarantee an
> emergency response. In an actual emergency, contact the appropriate
> local emergency service.

## Table of Contents

-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [Live Application & AWS Production Deployment](#live-application--aws-production-deployment)
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
    records associated with trusted contacts during the SOS flow.
-   **Notification dropdown:** View notification status and unread
    count, refresh records, and mark individual records as read.
-   **Settings:** View available account and session information,
    security guidance, and sign out.
-   **Help and Support:** Review emergency guidance, FAQs, and safety
    and privacy information.
-   **Dashboard:** Web interface for interacting with the application's
    modules.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS, Lucide React |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Token (JWT), bcryptjs |
| Security and middleware | Helmet, CORS, express-rate-limit |
| Web server | Nginx |
| Production transport | HTTPS |
| AWS deployment | IAM, VPC, EC2, EBS, S3 |

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

### Emergency notification records

The authenticated dashboard can display the user's notification
records, unread count, incident type, message, and read status. A user
can mark an individual record as read. These records are simulated and
do not indicate that an SMS or WhatsApp message was sent.

### GPS and safe zones

The frontend uses the browser Geolocation API. Location access requires
user permission and may require a secure context (HTTPS) outside
localhost. Safe-zone monitoring compares the user's reported coordinates
with saved zone boundaries and records events.

### Trusted contacts and history

Trusted contacts and incident history are managed through backend API
routes and persisted in MongoDB.

### Settings and Help & Support

Settings displays available account information and security guidance,
and provides the existing sign-out action. Account details are
read-only where profile-editing APIs are not available. Help & Support
provides emergency guidance, FAQs, and safety and privacy reminders.

## AWS Deployment

The production application is deployed at
[https://13-127-217-122.sslip.io](https://13-127-217-122.sslip.io). Its
AWS footprint is limited to the five services below:

| AWS service | Role in SHIELDHER |
|---|---|
| IAM | Manages identities and permissions. |
| VPC | Provides the AWS network environment. |
| EC2 | Runs the Node.js/Express backend and Nginx. |
| EBS | Provides block storage attached to EC2. |
| S3 | Hosts the static frontend. |

MongoDB Atlas provides the database outside this AWS service list. Nginx
is used in the production web-server path, and the public application
URL is HTTPS. The `sslip.io` hostname is based on the EC2 public IP, so
an IP change may require updating the hostname and related production
configuration.

For future releases, build the frontend with its production API
configuration and publish the build to the existing S3 frontend
hosting. Deploy backend changes to the existing EC2 application using
the established service process. Keep production environment files and
deployment credentials out of the repository. Route public web traffic
through Nginx and restrict SSH access to trusted source addresses.

## Security Notes

-   Never commit `.env`, database credentials, JWT secrets, PEM private
    keys, or AWS access keys.
-   Use least-privilege IAM roles instead of long-lived AWS access keys
    on EC2.
-   Keep SSH restricted to trusted source IP addresses.
-   The production application is available over HTTPS; continue to
    protect authentication and location data in transit.
-   Treat browser GPS data as user-device data that may be unavailable,
    inaccurate, or permission-denied.
-   Do not represent simulated notification records as real emergency
    communication.
-   SHIELDHER is an academic safety-support demo, not a replacement for
    local emergency services or a guaranteed emergency response.

## Current Limitations

-   SMS and WhatsApp delivery are not implemented; notification records
    are simulated.
-   Automatic police/emergency-service dispatch is not implemented.
-   GPS availability and accuracy depend on the user's device, browser,
    permissions, and network conditions.
-   The `sslip.io` hostname depends on the EC2 public IP and may need to
    be updated if that IP changes.
-   Account profile editing and password changes are not currently
    available in the application.
-   No separate support phone number, email address, or support URL is
    configured in the application.
-   The application is an academic demo and does not guarantee an
    emergency response.

## Future Improvements

-   Integrate a verified SMS/WhatsApp provider with consent, delivery
    tracking, and secure credential handling.
-   Add optional live location sharing with explicit user control.
-   Add push notifications and delivery status.
-   Add audit logging, monitoring, backups, and automated tests.
-   Continue production security, reliability, and privacy reviews.
-   Improve accessibility, responsive design, and usability testing.

------------------------------------------------------------------------

## Academic Project

**Project:** SHIELDHER -- Smart Women Safety & Emergency Response
Platform\
**Program:** B.Tech CSE (AI/ML)\
**Domain:** Web Development, Cloud Computing, and Emergency Response\
**Purpose:** Academic capstone project

For setup or deployment questions, review the project scripts in the
frontend and backend `package.json` files and keep all production
secrets outside source control.
