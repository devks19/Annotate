# Annotate

Annotate is a full-stack web application designed for collaborative video review and time-based feedback.  
It allows users to upload videos, add timestamped comments, and manage feedback in a structured workflow.

The project is built and deployed as a single unit using Docker, with a React frontend, a Spring Boot backend, and a PostgreSQL database.

---

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security (JWT)
- Hibernate / JPA
- PostgreSQL

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Framer Motion

### Infrastructure
- Docker
- Docker Compose

---

## Project Structure

Annotate-FullStack/
│
├── Annotate/              # Spring Boot backend
├── Annotate_Frontend/     # React + Vite frontend
├── docker-compose.yml
├── .env.example
└── README.md

---

## Running the Application (Docker)

### Prerequisites
- Docker
- Docker Compose

---

### Setup

Clone the repository:

```bash
git clone https://github.com/devks19/Annotate.git
cd Annotate-FullStack
```

Create environment variables:
```bash
cp .env.example .env
```
Build and start the application:
```bash
docker compose up --build
```
---

## Access URLs

Frontend  
```bash
http://localhost:3000
```
Backend API

```bash
http://localhost:8080
```
---

## File Upload Handling

User-uploaded videos are not stored in the Git repository.

All uploaded media is handled at runtime and stored using Docker volumes.  
This keeps the repository clean and avoids versioning large binary files.

---

## Notes

- Frontend and backend are maintained in a single repository for easier development and deployment.
- Sensitive configuration values are managed through environment variables.
- The application is designed to run consistently across local and containerized environments.

---

## Future Improvements

- External object storage for video uploads
- Reverse proxy setup using Nginx
- CI/CD pipeline for automated builds and deployments
- Improved access control and role management

---

## Author

Kanak Raj Saraf
