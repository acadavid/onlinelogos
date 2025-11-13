import { Schema, type, MapSchema } from '@colyseus/schema'

export class Shape extends Schema {
  @type('string') id: string = ''
  @type('number') x: number = 0
  @type('number') y: number = 0
  @type('number') radius: number = 30
  @type('string') color: string = '#00D2FF'
  @type('string') type: string = 'circle'
  @type('string') draggedBy: string = ''
}

export class GameState extends Schema {
  @type({ map: Shape }) shapes = new MapSchema<Shape>()
  @type('number') playerCount: number = 0
}
