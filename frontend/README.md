# CP-Tracker Frontend

The frontend for [CP-Tracker](https://buildmyresumes.online), a competitive programming progress dashboard. It is a React single-page application that lets users connect coding-platform handles, review aggregated statistics, explore daily problem recommendations, and share profile pages.

- **Live application:** https://buildmyresumes.online
- **Repository:** https://github.com/Gaurav0405/cp-tracker
- **Main project documentation:** [../README.md](../README.md)

## Features

- **Landing and authentication pages:** registration, login, and Google sign-in.
- **Protected dashboard and profile:** authenticated users can view their dashboard and manage their connected platform handles.
- **Multi-platform statistics:** dashboard views for statistics retrieved from LeetCode, Codeforces, CodeChef, GeeksforGeeks, HackerRank, and HackerEarth.
- **Problem recommendations:** displays the backend's daily recommendations and lets users mark recommendations as solved.
- **Progress visualizations:** difficulty breakdowns, weekly progress, recent solved activity, and contest-related UI components.
- **Problem search and social views:** problem search, friend leaderboard/activity components, and public profiles at `/u/:username`.
- **Theme switching and notifications:** dark/light theme preference and toast feedback for user actions.

The frontend presents data returned by the backend; platform coverage and results depend on the backend integrations and availability of external services. Recommendation generation is implemented by the backend.

## Tech Stack

- React with Create React App (`react-scripts`)
- React Router for client-side routes
- Axios for HTTP requests
- TanStack Query
- Recharts for charts
- Framer Motion for animations
- Firebase Authentication for Google sign-in
- React Icons and React Hot Toast

## Routes

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create an account |
| `/dashboard` | Authenticated | Statistics and daily recommendations |
| `/profile` | Authenticated | User profile and coding-platform handles |
| `/u/:username` | Public | Public profile |

The app uses a client-side `PrivateRoute` for the dashboard and private profile page. API authorization is handled separately by the backend.

## Requirements

- Node.js and npm
- The CP-Tracker backend running locally or a reachable deployed backend
- Firebase project configuration if you want Google sign-in to work in your own setup

## Run Locally

From the repository root:

```bash
cd frontend
npm ci
npm start
```

The Create React App development server normally opens at [http://localhost:3000](http://localhost:3000).

The current API client selects its base URL based on the browser hostname:

- When the hostname is `localhost`, requests go to `http://localhost:5000/api`.
- For other hostnames, requests go to `https://cp-tracker-backend-4nrv.onrender.com/api`.

Make sure the backend is running on port `5000` for local development. If you change the backend location, update `src/utils/api.js` deliberately and verify the production routing before deploying.

> **Configuration note:** `.env.production` currently contains `REACT_APP_API_URL=/api`, but the current Axios client does not read that variable. Do not assume changing it changes the API destination. The API URL is currently selected in `src/utils/api.js`.

## Google Sign-In Configuration

Google sign-in is implemented with Firebase Authentication in `src/utils/firebase.js` and is exchanged with the CP-Tracker backend through `/api/auth/google`.

For your own deployment:

1. Configure a Firebase project and enable the Google sign-in provider.
2. Set the correct authorized domains in Firebase Authentication.
3. Configure the frontend with the Firebase web-app settings for your project.
4. Ensure the backend accepts the matching Google sign-in flow.

The Firebase web configuration is client-side configuration, not a server-side secret. Apply appropriate API-key restrictions and configure Firebase security rules for any Firebase services you use. Never put backend secrets, database credentials, JWT secrets, or email passwords in frontend code.

## Available Scripts

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm start` | Start the local development server |
| `npm test` | Run the Create React App test runner in watch mode |
| `npm run build` | Create an optimized production build in `build/` |
| `npm run eject` | Eject from Create React App configuration (one-way operation; normally unnecessary) |

## Build for Production

```bash
npm ci
npm run build
```

The optimized static assets are written to `frontend/build/`. Deploy these assets using the hosting configuration for your environment. Client-side routing may require the host to serve `index.html` as a fallback for application routes.

The repository's current GitHub Actions workflow describes an EC2/SSH deployment, while the application has been associated with Vercel (frontend) and Render (backend). Confirm the actual hosting configuration before relying on that workflow; this README does not change deployment settings.

## Project Structure

```text
frontend/
├── public/                 # Static assets and HTML template
├── src/
│   ├── components/         # Dashboard, chart, activity, and social UI
│   ├── context/
│   │   └── AuthContext.js  # Authentication state and theme
│   ├── pages/              # Landing, login, register, dashboard, profiles
│   ├── utils/
│   │   ├── api.js          # Axios client and bearer-token header
│   │   └── firebase.js     # Firebase Authentication setup
│   ├── App.js              # Routes and protected-route wrapper
│   └── index.js            # React entry point
├── package.json
└── package-lock.json
```

## Authentication and API Requests

The Axios client in `src/utils/api.js` attaches the token stored in browser `localStorage` as an `Authorization: Bearer <token>` header when a token is present. Login and registration are handled through the backend; Google sign-in uses Firebase and then sends the resulting identity information to the backend.

Client-side route protection improves the user experience, but it is not a substitute for server-side authorization. The backend must validate tokens and protect user-specific endpoints.

## Troubleshooting

- **API requests fail locally:** check that the backend is running at `http://localhost:5000` and that its CORS configuration permits the local frontend origin.
- **API requests go to the wrong server:** inspect `src/utils/api.js`; the current client uses a hostname check rather than `REACT_APP_API_URL`.
- **Google sign-in fails:** verify Firebase provider settings, authorized domains, and the backend's Google authentication endpoint.
- **A direct link to a profile returns a hosting 404:** configure the production host to route client-side paths back to `index.html`.
- **Build or dependency issues:** use the committed lockfile with `npm ci`, and check the Node.js version supported by the installed dependencies.

## Maintainer

**Gaurav Jain** · [GitHub](https://github.com/Gaurav0405) · [LinkedIn](https://www.linkedin.com/in/gaurav-jain-b5b249278/)
