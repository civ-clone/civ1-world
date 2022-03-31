"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Yields_1 = require("../../Yields");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const TileImprovements_1 = require("../../TileImprovements");
const YieldModifier_1 = require("@civ-clone/core-world/Rules/YieldModifier");
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance) => [
    ...[
        [Yields_1.Food, 0.5],
        [Yields_1.Production, 0.5],
        [Yields_1.Trade, 0.5],
    ].map(([YieldType, multiplier]) => new YieldModifier_1.default(new Priorities_1.High(), new Criterion_1.default((tile, player, yields) => yields.some((tileYield) => tileYield instanceof YieldType)), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Railroad)), new Effect_1.default((tile, player, yields) => {
        const currentTotal = yields
            .filter((tileYield) => tileYield instanceof YieldType)
            .reduce((total, tileYield) => total + tileYield.value(), 0);
        yields.push(new YieldType(Math.floor(currentTotal * multiplier), TileImprovements_1.Railroad.name));
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map