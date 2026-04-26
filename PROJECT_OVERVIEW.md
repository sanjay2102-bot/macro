# MacroHostel India Architecture

## Folder Structure

```text
backend/
  src/
    config/db.js
    middleware/
    models/
    routes/
    seed/
    services/
    utils/
    validators/
    app.js
    server.js
frontend/
  src/
    api/client.js
    components/
    context/AuthContext.js
    screens/
    theme.js
    utils/date.js
```

## Database Schema

`User`
- `name`, `email`, `passwordHash`
- `profile`: age, gender, height, weight, activity level, hostel name, vegetarian preference
- `goal`: `bulking`, `cutting`, `maintenance`
- `macroTargets`: calories, protein, carbs, fats

`Food`
- Indian food item with serving size and per-serving macros
- tags, category, vegetarian flag, system/user ownership

`MessMeal`
- hostel quick-add preset made from multiple foods and quantities

`FoodLog`
- one user meal entry for a date and meal type
- supports food, manual, mess meal, and future image-recognition sources

`RecognitionJob`
- queued image analysis job placeholder for a future food recognition worker

`AssistantSession`
- chat messages for future LLM-backed diet assistant

## REST Endpoints

Authentication:
- `POST /api/auth/signup`
- `POST /api/auth/login`

Profile and goals:
- `GET /api/users/me`
- `PUT /api/users/profile`
- `POST /api/goals/calculate`
- `PUT /api/goals`

Food and logging:
- `GET /api/foods?q=dal`
- `POST /api/foods`
- `GET /api/mess-meals`
- `POST /api/logs`
- `GET /api/logs/day/:date`
- `GET /api/logs/week/:date`
- `DELETE /api/logs/:id`

Analytics and intelligence:
- `GET /api/analytics/daily/:date`
- `GET /api/analytics/weekly/:date`
- `GET /api/suggestions/:date`
- `POST /api/ai/recognition/prepare`
- `POST /api/assistant/messages`

## Key React Native Components

- `Screen`: safe-area mobile layout wrapper
- `Card`: repeated surface container
- `MetricTile`: compact dashboard KPI
- `MacroBar`: calories/protein/carbs/fats progress
- `PrimaryButton`: consistent touch target

## Screen Layouts

- `DashboardScreen`: calorie and protein tiles, macro progress bars, smart suggestion banner, meal timeline
- `LogFoodScreen`: search field, meal type segmented control, food result cards, quantity add panel
- `MessModeScreen`: meal slot tabs and one-tap hostel meal presets
- `GoalsScreen`: goal selector, profile form, calculated macro target card
- `AnalyticsScreen`: weekly calorie and protein line charts
- `AssistantScreen`: chat interface connected to an AI-ready backend route

## Setup

1. Start MongoDB locally or create a MongoDB Atlas database.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and `JWT_SECRET`.
3. Run `cd backend && npm install && npm run seed && npm run dev`.
4. Copy `frontend/.env.example` to `frontend/.env`.
5. Set `EXPO_PUBLIC_API_URL` to the backend API URL.
6. Run `cd frontend && npm install && npm start`.

For Android emulator, use your machine IP or `http://10.0.2.2:5000/api` instead of `localhost`.

