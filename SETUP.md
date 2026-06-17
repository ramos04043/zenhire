# ZenHire Setup Guide

Complete setup instructions for the ZenHire SaaS platform.

## Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

## Quick Start with Docker

The fastest way to get started:

```bash
# Clone and navigate to project
cd zenhire

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Manual Setup

### 1. Database Setup

Install and start PostgreSQL:

```bash
# Create database
createdb zenhire_db

# Or using psql
psql -U postgres
CREATE DATABASE zenhire_db;
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://zenhire:zenhire_dev_password@localhost:5432/zenhire_db
# JWT_SECRET=your-secret-key-change-in-production

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

Backend will be available at http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env
# VITE_API_BASE_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will be available at http://localhost:5173

## Database Migration

Create a new migration:

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Production Build

### Backend

```bash
cd backend
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend

```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/zenhire_db
JWT_SECRET=your-secret-key-minimum-32-characters
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Default Test User

After setup, register a new user or use these test credentials:

- Email: test@zenhire.com
- Password: test123

## Features Overview

- ✅ Complete Authentication (JWT)
- ✅ Resume Upload & Parsing
- ✅ ATS Score Analysis
- ✅ Application Tracking (Kanban)
- ✅ Job Discovery with AI Matching
- ✅ Real-time Notifications
- ✅ Dark/Light Theme
- ✅ Responsive Design
- ✅ Demo Mode for Testing

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8000
kill -9 <PID>
```

### Database Connection Error

- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Module Not Found

```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

## Support

For issues or questions, check the README.md or create an issue.
