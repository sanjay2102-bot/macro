# Launch Guide

This guide turns the local MacroHostel project into a GitHub repo, hosted API, and mobile app store build.

## 1. Local Production Checklist

- Backend runs on `PORT=5001`.
- Frontend points to `EXPO_PUBLIC_API_URL=http://localhost:5001/api` for local web.
- MongoDB Atlas is connected.
- Seed menu data is loaded with `npm run seed` from `backend`.
- `.env` files are not committed.

## 2. Push To GitHub

```bash
git init
git add .
git commit -m "Initial MacroHostel app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/macrohostel-india.git
git push -u origin main
```

Before pushing, confirm these are ignored:

```bash
git status --ignored
```

Do not commit:

- `backend/.env`
- `frontend/.env`
- `node_modules`
- `frontend/.expo`

## 3. Host Backend

Good beginner-friendly options:

- Render
- Railway
- Fly.io
- DigitalOcean App Platform

Render example:

1. Create a new Web Service from the GitHub repo.
2. Root directory: `backend`
3. Build command:

```bash
npm install
```

4. Start command:

```bash
npm start
```

5. Add environment variables:

```env
MONGO_URI=your-atlas-production-uri
JWT_SECRET=long-random-production-secret
JWT_EXPIRES_IN=7d
PORT=10000
CLIENT_ORIGIN=*
```

Render injects its own `PORT`; the backend already reads `process.env.PORT`.

After deploy, your API will look like:

```text
https://macrohostel-api.onrender.com/api
```

Test:

```text
https://macrohostel-api.onrender.com/health
```

## 4. Point Frontend To Production API

Set `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=https://macrohostel-api.onrender.com/api
```

Restart Expo after changing env values.

## 5. Expo Account And Builds

Install EAS CLI:

```bash
npm install -g eas-cli
```

Login:

```bash
eas login
```

From `frontend`:

```bash
eas init
eas build:configure
```

Build Android preview:

```bash
eas build --platform android --profile preview
```

Build production Android:

```bash
eas build --platform android --profile production
```

Build production iOS:

```bash
eas build --platform ios --profile production
```

## 6. App Store / Play Store

You need:

- Apple Developer Program account for iOS.
- Google Play Console account for Android.
- App icon and splash assets.
- Privacy policy URL.
- App screenshots.
- Production API URL.
- Test account for reviewers.

Recommended store description:

```text
MacroHostel India helps hostel students track calories, protein, carbs, and fats using Indian food presets, SRM-style mess menus, gym goals, and weekly macro analytics.
```

## 7. Privacy Policy Basics

Mention:

- Account email is used for login.
- Food logs and body profile data are stored for macro calculations.
- Data is stored in MongoDB Atlas.
- No financial, medical diagnosis, or ad targeting data is required.
- Users can request account deletion.

## 8. Production Hardening

Before public launch:

- Rotate the MongoDB password that appeared in screenshots.
- Replace `JWT_SECRET`.
- Use a production Atlas database user with least privilege.
- Add account deletion endpoint.
- Add password reset.
- Add request logging and monitoring.
- Add validation tests for auth, food logging, and analytics.
- Add proper app icons and splash screen.

