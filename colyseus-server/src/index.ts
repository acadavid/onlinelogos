import { Server } from 'colyseus'
import { WebSocketTransport } from '@colyseus/ws-transport'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { GameRoom } from './rooms/GameRoom'

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000']

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())

const httpServer = createServer(app)

const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
  }),
})

gameServer.define('game_room', GameRoom)
  .filterBy(['customRoomId'])

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

const PORT = process.env.COLYSEUS_PORT || 2567

httpServer.listen(PORT, () => {
  console.log(`🎮 Colyseus server listening on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})
