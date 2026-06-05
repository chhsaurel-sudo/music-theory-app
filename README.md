# music-theory-app

Minimal React + Vite app for exploring song theory and chord structure.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite in your browser.

## Project structure

- `index.html` — app entry point
- `src/main.jsx` — React root bootstrap
- `src/App.jsx` — main music theory app UI
- `package.json` — scripts and dependencies
- `vite.config.js` — Vite configuration

## Notes

- The app currently includes a sample song card for "Blinding Lights".
- It also includes a placeholder fetch flow for generating song analysis from an LLM.
- Add your own API key handling before using the `fetchSong` feature in production.
