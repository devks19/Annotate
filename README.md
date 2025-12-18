Annotate

Annotate is a full-stack web application built for collaborative video review and feedback.
It allows users to upload videos, add time-based annotations, and manage feedback in a structured way.

The project is built as a single deployable unit with a React frontend, a Spring Boot backend, and PostgreSQL, all containerized using Docker.

Tech Stack

Backend

Java

Spring Boot

Spring Security (JWT)

PostgreSQL

Hibernate / JPA

Frontend

React

Vite

Tailwind CSS

Axios

Framer Motion

Infrastructure

Docker

Docker Compose

Project Structure
Annotate-FullStack/
│
├── Annotate/              # Spring Boot backend
├── Annotate_Frontend/     # React + Vite frontend
├── docker-compose.yml
├── .env.example
└── README.md

Running the project with Docker
Prerequisites

Docker

Docker Compose

Steps:

Clone the repository

git clone https://github.com/devks19/Annotate.git
cd Annotate-FullStack


Create environment file

cp .env.example .env


Build and start all services

docker compose up --build

Accessing the application

Frontend: http://localhost:3000

Backend API: http://localhost:8080

PostgreSQL runs internally via Docker

File uploads

User-uploaded videos are not stored in the Git repository.

Uploads are handled at runtime and stored using Docker volumes.
This keeps the repository clean and avoids versioning large binary files.

Notes

Frontend and backend are kept in the same repository for easier local development and deployment.

Environment-specific values (database credentials, secrets, etc.) are not committed to Git.

The application is designed to run the same way locally and in containerized environments.
