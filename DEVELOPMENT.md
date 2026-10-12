# Development Guide

## Prerequisites

Install the following software before running the project.

- Java 21
- Apache Maven
- Node.js
- npm
- MySQL
- Git
- Docker (Optional)

---

## Clone Repository

```bash
git clone https://github.com/Cosmos-dot/EmailHeaderInvestigationAnalyzer1.git
```

---

## Backend Setup

Navigate to the backend folder.

```bash
cd EmailForensics_Phase1_Backend
```

Build the project.

```bash
mvn clean install
```

Run the application.

```bash
mvn spring-boot:run
```

Default URL

```
http://localhost:8080
```

---

## Frontend Setup

Navigate to the React frontend.

```bash
cd EmailForensics_Phase4_ReactFrontend
```

Install packages.

```bash
npm install
```

Run the application.

```bash
npm run dev
```

Default URL

```
http://localhost:5173
```

---

## Features

- User Authentication
- Email Header Analysis
- SPF Validation
- DKIM Validation
- DMARC Validation
- IP Address Extraction
- Risk Score Calculation
- Investigation Reports

---

## Build Commands

Backend

```bash
mvn clean package
```

Frontend

```bash
npm run build
```

---

## Git Commands

```bash
git add .
git commit -m "Project Update"
git push origin main
```