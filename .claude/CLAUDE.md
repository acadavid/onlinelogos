# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Rails 8.1 speech therapy application that will provide a split-screen interface:
- **Left side**: Interactive educational games on a canvas (synced in real-time between therapist and patient)
- **Right side**: Video calling via Zoom Video SDK for therapist-patient communication

The app uses modern Rails tooling with esbuild for JavaScript bundling, Vue 3 for interactive components, Tailwind CSS v3 for styling, and SQLite3 for the database.

### Current Status
- Vue 3 is set up for building game canvas components
- Zoom Video SDK UI Toolkit is installed and configured (not yet implemented)
- Game synchronization (Konva.js + Colyseus) not yet implemented

## Development Commands

### Server & Development
- `bin/setup` - Initial setup: installs dependencies, prepares database, starts dev server
- `bin/dev` - Start development server (runs Procfile.dev with foreman)
  - Runs Rails server on port 3000 with debugging enabled
  - Watches and builds JavaScript with esbuild
  - Watches and builds CSS with Tailwind
- `bin/rails server` - Start Rails server only (port 3000)
- `bin/rails console` - Start Rails console

### Asset Building
- `npm run build` - Build JavaScript with esbuild (one-time)
- `npm run build:css` - Build Tailwind CSS (one-time)
- Assets are bundled to `app/assets/builds/`

### Database
- `bin/rails db:prepare` - Create database if needed and run migrations
- `bin/rails db:migrate` - Run pending migrations
- `bin/rails db:reset` - Drop, create, and migrate database
- Uses SQLite3 with databases in `storage/` directory

### Testing
- `bin/rails test` - Run all tests
- `bin/rails test test/controllers/some_controller_test.rb` - Run specific test file
- `bin/rails test:system` - Run system tests (requires Selenium)

### Code Quality
- `bin/rubocop` - Run Ruby linter (Omakase style guide)
- `bin/brakeman` - Run security scanner
- `bin/bundler-audit` - Check for vulnerable dependencies

## Architecture

### JavaScript Architecture

- **Entry point**: `app/javascript/application.js`
- **Bundler**: esbuild with Vue 3 plugin (configured in `esbuild.config.mjs`)
- **Frameworks**:
  - Hotwire (Turbo + Stimulus) for page navigation and Rails interactions
  - Vue 3 for interactive game components (mounted to specific divs in Rails views)
- **Vue Components**: Located in `app/javascript/components/`
  - Components are exposed globally via `window.VueComponents`
  - Mount Vue apps using `window.createVueApp(component).mount('#element-id')`
  - Example: `HelloVue.vue` demonstrates basic setup at `app/javascript/components/HelloVue.vue`
- **Zoom SDK**: The `@zoom/videosdk-ui-toolkit` package is imported in `app/javascript/application.js:4` and exposed globally as `window.uitoolkit`, but no video conferencing features have been implemented yet
- **Controllers**: Stimulus controllers in `app/javascript/controllers/`

### Vue 3 Integration Pattern

Vue is used for interactive components (like game canvases) while Rails handles routing, authentication, and page rendering:

1. Create `.vue` single-file components in `app/javascript/components/`
2. Export them from `app/javascript/components/index.js`
3. In Rails views, add a div with an ID for the Vue app
4. Mount the Vue component with JavaScript:
   ```javascript
   const app = window.createVueApp(window.VueComponents.YourComponent)
   app.mount('#your-element-id')
   ```

This is NOT a full SPA - Rails renders pages, Vue handles specific interactive areas.

### CSS Architecture

- **Framework**: Tailwind CSS v3.4.17
- **Source**: `app/assets/stylesheets/application.tailwind.css`
- **Output**: `app/assets/builds/application.css`
- Bundled via cssbundling-rails with npm script

## Planned Architecture

### Game Implementation (Not Yet Implemented)
- **Konva.js** with **vue-konva** for canvas rendering inside Vue components
- **Colyseus** for real-time state synchronization between therapist and patient
- **Server-authoritative architecture**: All game logic runs on Colyseus server, clients only display state
- **Authentication**: Therapist/patient roles authenticated via Rails, passed to Colyseus via signed JWT tokens

### Video Conferencing (Not Yet Implemented)

To implement video conferencing features:

1. **Backend Setup**:
   - Store Zoom SDK credentials in Rails credentials (`zoom.sdk_key` and `zoom.sdk_secret`)
   - Create a controller to generate JWT tokens for Zoom sessions (the `jwt` gem is already installed)

2. **Frontend Setup**:
   - Create views with a session container div for the Zoom UI
   - Add a form for users to enter session details (name, role, etc.)
   - Use JavaScript to call the backend JWT endpoint
   - Initialize Zoom session with `window.uitoolkit.joinSession()`

3. **Routes**:
   - Add routes for the video pages and JWT generation endpoint

### Split-Screen Layout (Not Yet Implemented)
- Left side: Vue component with Konva canvas (game area)
- Right side: Zoom Video SDK container
- Note: Video and game state are completely separate, no state sharing needed

## Key Routes

- `GET /` (root) - Home page with Vue 3 test component (`home#index`)
- `GET /home/index` - Vue 3 test page
- `GET /up` - Health check endpoint (Rails health status)

## Dependencies

### Ruby Gems
- `rails` 8.1.1
- `jwt` - JWT encoding/decoding for Zoom authentication
- `turbo-rails`, `stimulus-rails` - Hotwire stack
- `jsbundling-rails`, `cssbundling-rails` - Asset pipeline
- `sqlite3` - Database
- Security/Quality: `brakeman`, `bundler-audit`, `rubocop-rails-omakase`

### JavaScript Packages
- `vue` 3.5.24 - Vue 3 framework for interactive components
- `esbuild-plugin-vue3` 0.5.1 - esbuild plugin to compile .vue single-file components
- `@zoom/videosdk-ui-toolkit` 2.2.10-1 - Zoom Video SDK UI components (installed but not yet implemented)
- `@hotwired/turbo-rails` 8.0.20, `@hotwired/stimulus` 3.2.2 - Hotwire stack
- `tailwindcss` 3.4.17 - CSS framework
- `esbuild` 0.25.12 - JavaScript bundler

### Packages to Install Later
- `konva` and `vue-konva` - Canvas rendering for games
- `colyseus.js` - Client library for real-time game state synchronization
