# Deployment Guide - Railway

This application runs both a Rails web server and a Colyseus game server in a single Docker container.

## Architecture

The app uses a **single Dockerfile** with **foreman** to run both servers:
- **Rails (Puma + Thruster)**: Runs on port 80 (web server)
- **Colyseus**: Runs on port 2567 (WebSocket game server)

Both servers run in the same container using the `Procfile` configuration.

## Prerequisites

1. [Railway CLI](https://docs.railway.app/develop/cli) installed (optional but recommended)
2. Railway account at [railway.app](https://railway.app)

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Easiest)

1. **Create a new project on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure environment variables**:

   In the Railway dashboard, go to your service → Variables and add:

   ```bash
   # Required: Rails master key for encrypted credentials
   RAILS_MASTER_KEY=<your-master-key-from-config/master.key>

   # Required: Colyseus WebSocket URL (use your Railway domain)
   COLYSEUS_URL=wss://your-app.railway.app:2567

   # Required: CORS origin for Colyseus (use your Railway domain)
   CORS_ORIGIN=https://your-app.railway.app

   # Required: Zoom SDK credentials (from config/zoom.yml)
   ZOOM_SDK_KEY=<your-zoom-sdk-key>
   ZOOM_SDK_SECRET=<your-zoom-sdk-secret>

   # Optional: Colyseus port (default: 2567)
   COLYSEUS_PORT=2567

   # Optional: Rails environment (default: production)
   RAILS_ENV=production
   ```

3. **Expose both ports**:

   Railway needs to expose both port 80 (Rails) and 2567 (Colyseus).

   **Important**: Railway only exposes one port by default. You'll need to:
   - The web server (port 80) will be automatically exposed
   - For Colyseus (port 2567), you have two options:

     **Option A - Use the same domain (Recommended)**:
     Update `COLYSEUS_URL` to use the same domain as your app:
     ```
     COLYSEUS_URL=wss://your-app.railway.app:2567
     ```

     **Option B - Use Railway's TCP Proxy**:
     Enable TCP proxy in Railway settings for port 2567

4. **Deploy**:
   - Railway will automatically build and deploy using the Dockerfile
   - Wait for the build to complete
   - Visit your app at the provided Railway URL

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize project**:
   ```bash
   railway init
   ```

4. **Set environment variables**:
   ```bash
   railway variables set RAILS_MASTER_KEY="$(cat config/master.key)"
   railway variables set COLYSEUS_URL="wss://your-app.railway.app:2567"
   railway variables set CORS_ORIGIN="https://your-app.railway.app"
   railway variables set ZOOM_SDK_KEY="your-zoom-sdk-key"
   railway variables set ZOOM_SDK_SECRET="your-zoom-sdk-secret"
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

6. **Open your app**:
   ```bash
   railway open
   ```

## Getting Your Railway Domain

After deployment:
1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Settings" tab
4. Find "Domains" section
5. Copy the generated domain (e.g., `your-app.up.railway.app`)
6. Update the `COLYSEUS_URL` and `CORS_ORIGIN` environment variables with this domain

## Important Notes

### Port Exposure
Railway only exposes one HTTP/HTTPS port by default. For the Colyseus WebSocket server:

1. **During initial setup**: Set `COLYSEUS_URL` to use the same domain with port 2567:
   ```
   COLYSEUS_URL=wss://your-app.railway.app:2567
   ```

2. **If WebSocket connections fail**: Railway may not expose port 2567 directly. In this case, you have two options:

   **Option A**: Use Railway's TCP Proxy feature (see Railway docs)

   **Option B**: Proxy Colyseus through Rails (requires code changes - ask Claude Code for help)

### Database
- The app uses SQLite3 which stores the database in `/rails/storage/`
- **Important**: Railway's filesystem is ephemeral, so data will be lost on redeploy
- For production, consider:
  - Adding a Railway PostgreSQL database plugin
  - Updating `database.yml` to use PostgreSQL in production
  - Migrating your app to use PostgreSQL

### Master Key
Your `config/master.key` is required to decrypt credentials. Keep it secure and never commit it to git.

To get your master key:
```bash
cat config/master.key
```

### Logs
View logs in real-time:
```bash
railway logs
```

Or in the Railway dashboard under the "Deployments" tab.

## Troubleshooting

### "Failed to connect to game server"
- Check that `COLYSEUS_URL` environment variable is set correctly
- Verify port 2567 is accessible (check Railway port settings)
- Check Colyseus logs: `railway logs | grep colyseus`

### "CORS error"
- Ensure `CORS_ORIGIN` matches your Railway domain exactly (including https://)
- Don't include trailing slashes in the URL

### "Master key error" or "Encrypted credentials"
- Make sure `RAILS_MASTER_KEY` is set in Railway environment variables
- Verify the key matches your local `config/master.key`

### "Zoom SDK not working"
- Verify `ZOOM_SDK_KEY` and `ZOOM_SDK_SECRET` are set correctly
- Check Zoom SDK credentials in your Zoom Marketplace app

### "Database not initialized"
The `bin/docker-entrypoint` script automatically runs migrations, but if you have issues:
```bash
railway run bin/rails db:prepare
```

## Local Testing with Docker

Test the production build locally before deploying:

1. **Build the Docker image**:
   ```bash
   docker build -t onlinelogo .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 80:80 -p 2567:2567 \
     -e RAILS_MASTER_KEY="$(cat config/master.key)" \
     -e COLYSEUS_URL="ws://localhost:2567" \
     -e CORS_ORIGIN="http://localhost" \
     -e ZOOM_SDK_KEY="your-key" \
     -e ZOOM_SDK_SECRET="your-secret" \
     --name onlinelogo \
     onlinelogo
   ```

3. **View logs**:
   ```bash
   docker logs -f onlinelogo
   ```

4. **Test**:
   - Open http://localhost in your browser
   - Verify both the game canvas and Zoom video work

5. **Stop and remove**:
   ```bash
   docker stop onlinelogo
   docker rm onlinelogo
   ```

## Next Steps After Deployment

1. **Custom Domain** (optional):
   - Add a custom domain in Railway dashboard
   - Update `COLYSEUS_URL` and `CORS_ORIGIN` to match

2. **PostgreSQL Migration** (recommended for production):
   - Add Railway PostgreSQL plugin
   - Update database configuration
   - Migrate data

3. **Monitoring**:
   - Set up error tracking (e.g., Sentry, Rollbar)
   - Monitor performance and logs

4. **SSL/Security**:
   - Railway provides SSL by default
   - Ensure `force_ssl = true` in production.rb (already set in Rails 8)

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RAILS_MASTER_KEY` | Yes | - | Rails encrypted credentials key |
| `COLYSEUS_URL` | Yes | `ws://localhost:2567` | WebSocket URL for Colyseus server |
| `CORS_ORIGIN` | Yes | `http://localhost:3000` | Allowed CORS origin (your app URL) |
| `ZOOM_SDK_KEY` | Yes | - | Zoom Video SDK key |
| `ZOOM_SDK_SECRET` | Yes | - | Zoom Video SDK secret |
| `COLYSEUS_PORT` | No | `2567` | Port for Colyseus server |
| `PORT` | No | `3000` | Port for Rails server (Railway sets this automatically) |
| `RAILS_ENV` | No | `production` | Rails environment |
| `RAILS_LOG_LEVEL` | No | `info` | Logging level |

## Support

For issues specific to:
- **Railway**: [Railway Docs](https://docs.railway.app)
- **This app**: Open an issue in your repository
- **Colyseus**: [Colyseus Docs](https://docs.colyseus.io)
- **Rails**: [Rails Guides](https://guides.rubyonrails.org)
