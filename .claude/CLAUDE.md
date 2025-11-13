# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Rails 8.1 application with Zoom Video SDK integration. The app uses modern Rails tooling with esbuild for JavaScript bundling, Tailwind CSS v4 for styling, and SQLite3 for the database. The primary feature is video conferencing functionality powered by the Zoom Video SDK UI Toolkit.

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
- `bin/rails test test/controllers/video_controller_test.rb` - Run specific test file
- `bin/rails test:system` - Run system tests (requires Selenium)

### Code Quality
- `bin/rubocop` - Run Ruby linter (Omakase style guide)
- `bin/brakeman` - Run security scanner
- `bin/bundler-audit` - Check for vulnerable dependencies

## Architecture

### Video Conferencing Flow

The Zoom Video SDK integration follows this pattern:

1. **Frontend Request** (`app/views/video/test.html.erb`): User fills session details (session name, username, passcode, role)
2. **JWT Generation** (`video#generate_jwt` at `app/controllers/video_controller.rb:5`): Backend generates a signed JWT token using Zoom SDK credentials stored in Rails credentials
3. **Session Join**: Frontend receives JWT and uses `window.uitoolkit.joinSession()` to connect to Zoom session
4. **Video UI**: Zoom Video SDK UI Toolkit renders in the `#sessionContainer` div

### Credentials Management

Zoom SDK credentials are stored in encrypted Rails credentials:
- `Rails.application.credentials.zoom.sdk_key` - Zoom SDK Key
- `Rails.application.credentials.zoom.sdk_secret` - Zoom SDK Secret
- Edit with: `bin/rails credentials:edit`

### JWT Token Structure

Generated JWTs (`app/controllers/video_controller.rb:12`) contain:
- `app_key`: Zoom SDK key
- `tpc`: Session topic/name
- `role_type`: 0 (participant) or 1 (host)
- `version`: Always 1
- `iat`: Issued at time (30 seconds in the past to account for clock skew)
- `exp`: Expiration (2 hours from issuance)

### JavaScript Architecture

- **Entry point**: `app/javascript/application.js`
- **Bundler**: esbuild (configured in `package.json`)
- **Framework**: Hotwire (Turbo + Stimulus)
- **Zoom SDK**: Imported as `uitoolkit` and exposed globally via `window.uitoolkit`
- **Controllers**: Stimulus controllers in `app/javascript/controllers/`

### CSS Architecture

- **Framework**: Tailwind CSS v4 (using standalone CLI)
- **Source**: `app/assets/stylesheets/application.tailwind.css`
- **Output**: `app/assets/builds/application.css`
- Uses Tailwind's `@tailwindcss/cli` package directly (no config file needed for v4)

## Key Routes

- `GET /video/test` - Video conferencing test page
- `POST /video/generate_jwt` - Generate JWT for Zoom session (expects `session_name` and optional `role_type`)
- `GET /up` - Health check endpoint

## Dependencies

### Ruby Gems
- `rails` 8.1.1
- `jwt` - JWT encoding/decoding for Zoom authentication
- `turbo-rails`, `stimulus-rails` - Hotwire stack
- `jsbundling-rails`, `cssbundling-rails` - Asset pipeline
- `sqlite3` - Database
- Security/Quality: `brakeman`, `bundler-audit`, `rubocop-rails-omakase`

### JavaScript Packages
- `@zoom/videosdk-ui-toolkit` 2.2.10-1 - Zoom Video SDK UI components
- `@hotwired/turbo-rails`, `@hotwired/stimulus` - Hotwire
- `tailwindcss` 4.1.17 - CSS framework
- `esbuild` - JavaScript bundler
