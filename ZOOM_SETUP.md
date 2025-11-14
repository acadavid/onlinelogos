# Zoom Video SDK Setup

This app uses the Zoom Video SDK for video calling. The credentials are already configured in `config/zoom.yml`.

## Current Configuration

The app is configured with Zoom SDK credentials in `config/zoom.yml`:
- **SDK Key**: Q2WzOJibv2YPlVSeDa8J7Ach2XY7ryA2gDeb
- **SDK Secret**: lOi7H2erM3aZIjnsjVd496ags6f5JiitgzSo

## If You Need to Update Credentials

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Sign in with your Zoom account
3. Click "Develop" → "Build App"
4. Select "Video SDK" and create a new app
5. Once created, you'll get your SDK Key and SDK Secret

6. Edit `config/zoom.yml` and replace the values:

```yaml
sdk_key: YOUR_NEW_SDK_KEY_HERE
sdk_secret: YOUR_NEW_SDK_SECRET_HERE
```

7. Restart the Rails server

## 3. Test the Video Call

1. Start the server: `bin/dev`
2. Visit the app and navigate to a room
3. On the right side, enter your name and click "Join Video Call"
4. Open the same URL in another browser/window to test multi-party video

## Troubleshooting

### "Zoom SDK credentials not configured" error
- Make sure you've added the credentials as shown above
- Restart your Rails server after editing credentials

### Video doesn't load
- Check the browser console for errors
- Ensure your Zoom SDK app is enabled in the Marketplace
- Verify the SDK Key and Secret are correct

### Camera/Microphone not working
- Grant browser permissions for camera and microphone
- Check your browser's site settings
- Try using HTTPS if testing remotely (required for camera/mic access)

## Development Notes

- The JWT token is generated server-side for security
- Tokens expire after 2 hours
- Each room URL creates a unique Zoom session
- The session name is the room ID from the URL
