# Modern Tetris (Ocean Professional)

A modern, responsive Tetris built with React (Create React App). It features keyboard and touch controls, live stats, next-piece preview, ghost piece, soft/hard drop scoring, level-based gravity, and a light/dark theme toggle.

## Play Guide

### Controls
- Start: Enter
- Move: Left/Right arrows (← →)
- Soft drop: Down arrow (↓)
- Hard drop: Space
- Rotate: Z (counter‑clockwise), X or Up arrow (↑) for clockwise
- Pause/Resume: P
- Restart: R

Touch controls are available via on-screen buttons under the board:
- Move: Left / Right
- Soft drop: Down
- Hard drop: Drop icon
- Rotate: CCW/CW buttons
- Start/Pause/Resume/Restart buttons manage game state

### Scoring and Levels
- Line clear scoring (multiplied by current level):
  - Single: 100 points
  - Double: 300 points
  - Triple: 500 points
  - Tetris (4 lines): 800 points
- Soft drop: +1 point per step while moving the piece down
- Hard drop: +2 points per cell the piece travels before locking
- Levels increase automatically approximately every 10 lines cleared. Higher levels reduce gravity interval to speed up piece fall.

### Pause and Restart Behavior
- P toggles pause/resume during an active game. When paused, input is ignored until resumed.
- R restarts from a fresh state at Level 1 at any time (including after Game Over).
- Enter starts a new game when idle.

### Responsiveness and UI Notes
- The layout adapts for smaller screens: the sidebar (Stats, Next preview, High Score) stacks below the board.
- A ghost piece shows the landing position to aid placement.
- A local High Score is persisted in the browser (localStorage).
- The theme toggle in the header switches light/dark via data-theme attributes.

## Run, Test, Build, and Deploy (Create React App)

This project uses Create React App (CRA).

### Prerequisites
- Node.js 16+ recommended
- npm or yarn

### Scripts
- Development: `npm start`
  - Starts at http://localhost:3000 with hot reload.
- Tests: `npm test`
  - Runs interactive tests (Jest + React Testing Library).
- Production build: `npm run build`
  - Outputs an optimized build to the `build/` folder.

### Environment Variables
The app is client-only and does not require backend variables for core gameplay. If needed, CRA supports variables prefixed with REACT_APP_. Common placeholders in this workspace include:
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

Create a `.env` file in the project root if you intend to use any of these (optional).

### Deploying the Build
- Static hosting: Upload the contents of `build/` to any static hosting provider (e.g., Netlify, Vercel, GitHub Pages, S3/CloudFront, Firebase Hosting).
- Custom server: Serve the `build/` directory using any static file server (e.g., `serve -s build`, Nginx). No server-side rendering is required.

## Project Structure (Frontend)
- src/components: Board, Controls, Game, NextPiece, Sidebar
- src/hooks: useTetris (game logic + loop)
- src/utils: constants (scoring, key bindings, speeds), engine (collision, merging, clears, ghost), pieces (rotations, bag)
- src/App.js / App.css: App shell and theme toggle
- src/index.js / index.css: App bootstrap and global styles

## License
For internal demo and evaluation purposes.
