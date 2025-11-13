"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const colyseus_1 = require("colyseus");
const GameState_1 = require("../schema/GameState");
class GameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 10;
    }
    onCreate(options) {
        this.setState(new GameState_1.GameState());
        console.log('GameRoom created!', this.roomId);
        this.onMessage('move', (client, message) => {
            const { shapeId, x, y } = message;
            const shape = this.state.shapes.get(shapeId);
            if (shape) {
                shape.x = x;
                shape.y = y;
            }
        });
        this.onMessage('dragStart', (client, message) => {
            const { shapeId } = message;
            const shape = this.state.shapes.get(shapeId);
            if (shape) {
                shape.draggedBy = client.sessionId;
            }
        });
        this.onMessage('dragEnd', (client, message) => {
            const { shapeId } = message;
            const shape = this.state.shapes.get(shapeId);
            if (shape && shape.draggedBy === client.sessionId) {
                shape.draggedBy = '';
            }
        });
        this.createInitialShapes();
    }
    createInitialShapes() {
        const colors = ['#00D2FF', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FFD93D'];
        for (let i = 0; i < 5; i++) {
            const shape = new GameState_1.Shape();
            shape.id = `shape-${i}`;
            shape.x = 100 + (i * 120);
            shape.y = 200;
            shape.radius = 30 + (i * 5);
            shape.color = colors[i];
            shape.type = 'circle';
            this.state.shapes.set(shape.id, shape);
        }
    }
    onJoin(client, options) {
        console.log(client.sessionId, 'joined!');
        this.broadcast('message', `${client.sessionId} joined the room`);
    }
    onLeave(client, consented) {
        console.log(client.sessionId, 'left!');
        this.state.shapes.forEach((shape) => {
            if (shape.draggedBy === client.sessionId) {
                shape.draggedBy = '';
            }
        });
    }
    onDispose() {
        console.log('room', this.roomId, 'disposing...');
    }
}
exports.GameRoom = GameRoom;
