"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = exports.Shape = void 0;
const schema_1 = require("@colyseus/schema");
class Shape extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.id = '';
        this.x = 0;
        this.y = 0;
        this.radius = 30;
        this.color = '#00D2FF';
        this.type = 'circle';
        this.draggedBy = '';
    }
}
exports.Shape = Shape;
__decorate([
    (0, schema_1.type)('string'),
    __metadata("design:type", String)
], Shape.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)('number'),
    __metadata("design:type", Number)
], Shape.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)('number'),
    __metadata("design:type", Number)
], Shape.prototype, "y", void 0);
__decorate([
    (0, schema_1.type)('number'),
    __metadata("design:type", Number)
], Shape.prototype, "radius", void 0);
__decorate([
    (0, schema_1.type)('string'),
    __metadata("design:type", String)
], Shape.prototype, "color", void 0);
__decorate([
    (0, schema_1.type)('string'),
    __metadata("design:type", String)
], Shape.prototype, "type", void 0);
__decorate([
    (0, schema_1.type)('string'),
    __metadata("design:type", String)
], Shape.prototype, "draggedBy", void 0);
class GameState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.shapes = new schema_1.MapSchema();
    }
}
exports.GameState = GameState;
__decorate([
    (0, schema_1.type)({ map: Shape }),
    __metadata("design:type", Object)
], GameState.prototype, "shapes", void 0);
