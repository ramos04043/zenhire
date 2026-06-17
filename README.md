# ZenHire

Job search tracking powered by ZendBX.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## What It Does

- **Track Applications** - Kanban board for all your job applications
- **ATS Score** - Upload resume, get instant compatibility score  
- **Job Matching** - Find jobs that match your skills
- **Analytics** - Track your progress with charts

## Backend

Uses **ZendBX** for:
- Authentication (signup, login, sessions)
- Database (PostgreSQL tables)
- Storage (resume files, profile images)
- Real-time updates

## Configuration

Create `frontend/.env`:

```env
VITE_ZENDBX_PROJECT_ID=718af5ef-8ffb-49ba-b54a-26cc37755d2c
VITE_ZENDBX_API_URL=https://zendbx-2-zpp9.onrender.com/p/zenhire-718af5ef
VITE_ZENDBX_ANON_KEY=your-anon-key
```

## Architecture

```
UI Components → Service Layer → ZendBX SDK → ZendBX Cloud
```

- Never access ZendBX directly from components
- All operations go through `ZendBXService`
- Clean separation of concerns

## Tech

- React + TypeScript
- ZendBX SDK
- Tailwind CSS
- Zustand (state)
- Recharts (charts)
- Framer Motion (animations)

## Build

```bash
npm run build
```

Deploy the `dist/` folder.

## License

MIT
