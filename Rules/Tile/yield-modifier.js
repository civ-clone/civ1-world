"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const governmentTileYield_1 = require("../../lib/governmentTileYield");
const Yields_1 = require("../../Yields");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const TileImprovements_1 = require("../../TileImprovements");
const YieldModifier_1 = require("@civ-clone/core-world/Rules/YieldModifier");
const playerGovernment = (player, playerGovernmentRegistry) => {
    if (player === null) {
        return null;
    }
    try {
        return playerGovernmentRegistry.getByPlayer(player);
    }
    catch (e) {
        // A player with no government yet, such as one being set up.
        if (e instanceof TypeError &&
            e.message.match(/Wrong number of PlayerGovernments/)) {
            return null;
        }
        throw e;
    }
};
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance) => [
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
    // Anarchy and Despotism take 1 off a yield of more than 2, then The Republic and Democracy add 1 to any trade, after
    //  the railroad and before pollution (v474.05 `CityWorker.cs` L4102-4134, civ-clone/web-renderer#401). This is for
    //  a city that isn't celebrating; civ1-city-happiness adds the difference for one that is. The two are added as
    //  separate yields, so the city can find what the tile yielded before them.
    ...[
        [
            governmentTileYield_1.DESPOTISM_PENALTY,
            (YieldType, value, government) => (0, governmentTileYield_1.despotismPenalty)(value, government),
        ],
        [governmentTileYield_1.TRADE_BONUS, governmentTileYield_1.tradeBonus],
    ].flatMap(([provider, step]) => governmentTileYield_1.governmentTileYieldTypes.map((YieldType) => new YieldModifier_1.default(new Priorities_1.Normal(), new Effect_1.default((tile, player, yields) => {
        const currentTotal = yields
            .filter((tileYield) => tileYield instanceof YieldType)
            .reduce((total, tileYield) => total + tileYield.value(), 0), adjusted = step(YieldType, currentTotal, playerGovernment(player, playerGovernmentRegistry));
        if (adjusted === currentTotal) {
            return;
        }
        yields.push(new YieldType(adjusted - currentTotal, provider));
    })))),
    // Pollution halves a tile's food, shields and trade, rounded up, after everything else (v474.05 `CityWorker.cs`
    //  ~L4138, civ-clone/web-renderer#32).
    ...[Yields_1.Food, Yields_1.Production, Yields_1.Trade].map((YieldType) => new YieldModifier_1.default(new Priorities_1.Low(), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Pollution)), new Effect_1.default((tile, player, yields) => {
        const currentTotal = yields
            .filter((tileYield) => tileYield instanceof YieldType)
            .reduce((total, tileYield) => total + tileYield.value(), 0), halved = Math.ceil(currentTotal / 2);
        if (halved === currentTotal) {
            return;
        }
        yields.push(new YieldType(halved - currentTotal, TileImprovements_1.Pollution.name));
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map