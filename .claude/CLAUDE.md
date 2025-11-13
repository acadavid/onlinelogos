# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Rails 8.1 application set up with Zoom Video SDK dependencies. The app uses modern Rails tooling with esbuild for JavaScript bundling, Tailwind CSS v3 for styling, and SQLite3 for the database. The Zoom Video SDK UI Toolkit is installed and configured in the JavaScript layer, but no video conferencing features have been implemented yet.

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
- **Bundler**: esbuild (configured in `package.json`)
- **Framework**: Hotwire (Turbo + Stimulus)
- **Zoom SDK**: The `@zoom/videosdk-ui-toolkit` package is imported in `app/javascript/application.js:4` and exposed globally as `window.uitoolkit`, but no video conferencing features have been implemented yet
- **Controllers**: Stimulus controllers in `app/javascript/controllers/`

### CSS Architecture

- **Framework**: Tailwind CSS v3.4.17
- **Source**: `app/assets/stylesheets/application.tailwind.css`
- **Output**: `app/assets/builds/application.css`
- Bundled via cssbundling-rails with npm script

## Implementing Zoom Video Conferencing

To implement video conferencing features, the following would be needed:

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

## Key Routes

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
- `@zoom/videosdk-ui-toolkit` 2.2.10-1 - Zoom Video SDK UI components (installed but not yet implemented)
- `@hotwired/turbo-rails` 8.0.20, `@hotwired/stimulus` 3.2.2 - Hotwire stack
- `tailwindcss` 3.4.17 - CSS framework
- `esbuild` 0.25.12 - JavaScript bundler
