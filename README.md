# MacroHostel India

Production-ready mobile-first macros tracking app for Indian diets and hostel students.

This repository contains:

- `backend`: Node.js, Express, MongoDB, JWT auth, macro engine, food logging, analytics, smart suggestions.
- `frontend`: React Native Expo app with mobile-first screens for auth, dashboard, food logging, mess mode, goals, analytics, and assistant-ready UX.

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

Set `EXPO_PUBLIC_API_URL` in `frontend/.env` to your backend URL, for example:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PUT /api/users/profile`
- `GET /api/foods`
- `POST /api/foods`
- `GET /api/mess-meals`
- `POST /api/logs`
- `GET /api/logs/day/:date`
- `GET /api/logs/week/:date`
- `DELETE /api/logs/:id`
- `POST /api/goals/calculate`
- `PUT /api/goals`
- `GET /api/analytics/daily/:date`
- `GET /api/analytics/weekly/:date`
- `GET /api/suggestions/:date`
- `POST /api/ai/recognition/prepare`
- `POST /api/assistant/messages`

## MongoDB Models

- `User`: auth, profile, hostel/gym metadata, active macro targets.
- `Food`: Indian food database with per-serving macros and tags.
- `MessMeal`: quick-add hostel meal presets.
- `FoodLog`: user meal entries with calculated consumed macros.
- `AssistantSession`: AI-ready chat session structure.
- `RecognitionJob`: image recognition placeholder for future model integration.

## UI Layout

- **Dashboard**: today's calories and macro rings, smart suggestion banner, meal timeline, weekly mini chart.
- **Log Food**: searchable Indian food database, manual entry form, recent foods.
- **Mess Mode**: breakfast/lunch/dinner cards for common hostel plates.
- **Goals**: bulk/cut/maintain segmented control, gym profile form, calculated targets.
- **Analytics**: daily and weekly charts, protein consistency, calorie trend.
- **Assistant**: chat shell ready for diet suggestions and future AI tooling.

