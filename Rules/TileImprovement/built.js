"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Built_1 = require("@civ-clone/core-tile-improvement/Rules/Built");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance) => [
    new Built_1.default(new Criterion_1.default((tile, tileImprovement) => tileImprovementRegistry
        .getByTile(tile)
        .every((existingTileImprovement) => tileImprovement.constructor !== existingTileImprovement.constructor)), new Effect_1.default((tile, tileImprovement) => tileImprovementRegistry.register(tileImprovement))),
    new Built_1.default(new Effect_1.default((tile) => tile.clearYieldCache(null))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map