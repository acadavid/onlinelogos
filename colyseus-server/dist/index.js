"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const ws_transport_1 = require("@colyseus/ws-transport");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const GameRoom_1 = require("./rooms/GameRoom");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
const gameServer = new colyseus_1.Server({
    transport: new ws_transport_1.WebSocketTransport({
        server: httpServer,
    }),
});
gameServer.define('game_room', GameRoom_1.GameRoom);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
const PORT = process.env.PORT || 2567;
httpServer.listen(PORT, () => {
    console.log(`🎮 Colyseus server listening on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
