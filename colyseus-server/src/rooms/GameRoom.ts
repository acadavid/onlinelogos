import { Room, Client } from 'colyseus'
import { GameState, Shape } from '../schema/GameState'

export class GameRoom extends Room<GameState> {
  maxClients = 10

  onCreate(options: any) {
    this.setState(new GameState())

    if (options.customRoomId) {
      this.setMetadata({ customRoomId: options.customRoomId })
    }

    console.log('GameRoom created!', this.roomId, 'customRoomId:', options.customRoomId)

    this.onMessage('move', (client, message) => {
      const { shapeId, x, y } = message
      const shape = this.state.shapes.get(shapeId)

      if (shape) {
        shape.x = x
        shape.y = y
      }
    })

    this.onMessage('dragStart', (client, message) => {
      const { shapeId } = message
      const shape = this.state.shapes.get(shapeId)

      if (shape) {
        shape.draggedBy = client.sessionId
      }
    })

    this.onMessage('dragEnd', (client, message) => {
      const { shapeId } = message
      const shape = this.state.shapes.get(shapeId)

      if (shape && shape.draggedBy === client.sessionId) {
        shape.draggedBy = ''
      }
    })

    this.createInitialShapes()
  }

  createInitialShapes() {
    const colors = ['#00D2FF', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FFD93D']

    for (let i = 0; i < 5; i++) {
      const shape = new Shape()
      shape.id = `shape-${i}`
      shape.x = 100 + (i * 120)
      shape.y = 200
      shape.radius = 30 + (i * 5)
      shape.color = colors[i]
      shape.type = 'circle'

      this.state.shapes.set(shape.id, shape)
    }
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!')
    this.state.playerCount = this.clients.length
    this.broadcast('message', `${client.sessionId} joined the room`)
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!')

    this.state.shapes.forEach((shape) => {
      if (shape.draggedBy === client.sessionId) {
        shape.draggedBy = ''
      }
    })

    this.state.playerCount = this.clients.length
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...')
  }
}
