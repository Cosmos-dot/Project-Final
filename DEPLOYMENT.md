# Deployment Guide

## Local Deployment

### Backend

Navigate to the backend folder.

```bash
cd EmailForensics_Phase1_Backend
```

Run the application.

```bash
mvn spring-boot:run
```

---

### Frontend

Navigate to the frontend folder.

```bash
cd EmailForensics_Phase4_ReactFrontend
```

Install dependencies.

```bash
npm install
```

Run the application.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

Backend URL

```
http://localhost:8080
```

---

# Docker Deployment

Build Docker images.

```bash
docker-compose build
```

Run Docker containers.

```bash
docker-compose up -d
```

Stop Docker containers.

```bash
docker-compose down
```

---

# Railway Deployment

1. Push the latest code to GitHub.
2. Login to Railway.
3. Create a new project.
4. Connect the GitHub repository.
5. Select **EmailHeaderInvestigationAnalyzer1**.
6. Railway will automatically build and deploy the application.

---

# Render Deployment

1. Login to Render.
2. Create a new Web Service.
3. Connect the GitHub repository.
4. Configure the build command.

```
mvn clean package
```

5. Configure the start command.

```
java -jar target/email-forensics-backend-1.0.0.jar
```

6. Deploy the application.

---

# Environment Variables

```
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
JWT_SECRET=
```

---

# Deployment Checklist

- Java Installed
- Maven Installed
- Node.js Installed
- MySQL Running
- Docker Installed (Optional)
- GitHub Repository Updated
- Environment Variables Configured