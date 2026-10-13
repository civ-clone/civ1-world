"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Removed_1 = require("@civ-clone/core-tile-improvement/Rules/Removed");
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, engine = Engine_1.instance) => [
    new Removed_1.default('civ1-world:tile-improvement/removed/unregister', new Criterion_1.default((tile, tileImprovement) => tileImprovementRegistry.getByTile(tile).includes(tileImprovement)), new Effect_1.default((tile, tileImprovement) => tileImprovementRegistry.unregister(tileImprovement))),
    new Removed_1.default('civ1-world:tile-improvement/removed/clear-yield-cache', new Effect_1.default((tile) => tile.clearYieldCache(null))),
    new Removed_1.default('civ1-world:tile-improvement/removed/emit', new Effect_1.default((tile, tileImprovement) => {
        engine.emit('tile-improvement:removed', tile, tileImprovement);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=removed.js.map