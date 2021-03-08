"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Pillaged_1 = require("@civ-clone/core-tile-improvement/Rules/Pillaged");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, engine = Engine_1.instance) => [
    new Pillaged_1.default(new Criterion_1.default((tile, tileImprovement) => tileImprovementRegistry.getByTile(tile).includes(tileImprovement)), new Effect_1.default((tile, tileImprovement) => tileImprovementRegistry.unregister(tileImprovement))),
    new Pillaged_1.default(new Effect_1.default((tile) => tile.clearYieldCache(null))),
    new Pillaged_1.default(new Effect_1.default((tile, tileImprovement) => {
        engine.emit('tile-improvement:pillaged', tile, tileImprovement);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pillaged.js.map