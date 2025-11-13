# Colyseus Game Server

This is the Colyseus server for the speech therapy app, providing real-time multiplayer game synchronization.

## Architecture

- **Server-authoritative**: All game logic runs on the server, clients just display state
- **WebSocket**: Real-time bidirectional communication
- **Schema**: Efficient state synchronization using Colyseus Schema system

## Development

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Build TypeScript
npm run build
```

Server runs on **port 2567** by default.

## Structure

```
src/
├── index.ts              # Server entry point
├── rooms/
│   └── GameRoom.ts       # Game room with logic and handlers
└── schema/
    └── GameState.ts      # Synchronized state structure
```

## Game Room

The `GameRoom` handles:
- Creating initial game state (5 colored circles)
- Receiving messages from clients (`move`, `dragStart`, `dragEnd`)
- Updating state in response to messages
- Broadcasting state changes to all clients

## State Schema

```typescript
class Shape {
  id: string
  x: number
  y: number
  radius: number
  color: string
  type: string
  draggedBy: string  // session ID of client dragging this shape
}

class GameState {
  shapes: MapSchema<Shape>
}
```

## Client Messages

Clients send these messages to update state:

- `move`: `{ shapeId: string, x: number, y: number }` - Move a shape
- `dragStart`: `{ shapeId: string }` - Mark shape as being dragged
- `dragEnd`: `{ shapeId: string }` - Release shape from dragging

## Health Check

GET http://localhost:2567/health

Returns server status and uptime.
