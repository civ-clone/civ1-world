"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const TileImprovements_1 = require("../../TileImprovements");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Built_1 = require("@civ-clone/core-tile-improvement/Rules/Built");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, engine = Engine_1.instance) => [
    new Built_1.default(new Criterion_1.default((tile, tileImprovement) => tileImprovementRegistry
        .getByTile(tile)
        .every((existingTileImprovement) => tileImprovement.constructor !== existingTileImprovement.constructor)), new Effect_1.default((tile, tileImprovement) => tileImprovementRegistry.register(tileImprovement))),
    new Built_1.default(new Effect_1.default((tile) => tile.clearYieldCache(null))),
    new Built_1.default(new Effect_1.default((tile, tileImprovement) => {
        engine.emit('tile-improvement:built', tile, tileImprovement);
    })),
    ...[
        [TileImprovements_1.Mine, TileImprovements_1.Irrigation],
        [TileImprovements_1.Irrigation, TileImprovements_1.Mine],
    ].map(([Improvement, ToRemove]) => new Built_1.default(new Criterion_1.default((tile, tileImprovement) => tileImprovement instanceof Improvement), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((tileImprovement) => tileImprovement instanceof ToRemove)), new Effect_1.default((tile) => tileImprovementRegistry.unregister(...tileImprovementRegistry
        .getByTile(tile)
        .filter((tileImprovement) => tileImprovement instanceof ToRemove))))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map