"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.governmentTileYield = exports.tradeBonus = exports.despotismPenalty = exports.governmentTileYieldTypes = exports.TRADE_BONUS = exports.DESPOTISM_PENALTY = void 0;
const Governments_1 = require("@civ-clone/library-government/Governments");
const Yields_1 = require("../Yields");
// The providers of the yields the government's steps add to a tile, so a city can tell them from the tile's own.
exports.DESPOTISM_PENALTY = 'civ1-world:despotism-penalty';
exports.TRADE_BONUS = 'civ1-world:trade-bonus';
exports.governmentTileYieldTypes = [
    Yields_1.Food,
    Yields_1.Production,
    Yields_1.Trade,
];
/**
 * Step 1 of what the government does to one of a square's yields, after the railroad (v474.05 `CityWorker.cs`
 *  `F0_1d12_6abc_GetCityResourceCount`, L4102-4113, civ-clone/web-renderer#401): under Anarchy and Despotism, a yield
 *  of more than 2 loses 1, unless the city is celebrating.
 */
const despotismPenalty = (value, government, celebrating = false) => value > 2 && !celebrating && (government === null || government === void 0 ? void 0 : government.is(Governments_1.Anarchy, Governments_1.Despotism))
    ? value - 1
    : value;
exports.despotismPenalty = despotismPenalty;
/**
 * Step 2, on what step 1 left (L4115-4134): trade, if there is any, gains 1 under The Republic and Democracy, or, while
 *  the city celebrates, under Monarchy and Communism too.
 */
const tradeBonus = (YieldType, value, government, celebrating = false) => value > 0 &&
    YieldType === Yields_1.Trade &&
    government !== null &&
    (celebrating
        ? government.is(Governments_1.Communism, Governments_1.Democracy, Governments_1.Monarchy, Governments_1.Republic)
        : government.is(Governments_1.Democracy, Governments_1.Republic))
    ? value + 1
    : value;
exports.tradeBonus = tradeBonus;
/**
 * Both steps, before pollution halves the result. `value` is the yield after the railroad. A tile's own yields are
 *  worked out for a city that isn't celebrating; a celebrating city adds the difference.
 */
const governmentTileYield = (YieldType, value, government, celebrating = false) => (0, exports.tradeBonus)(YieldType, (0, exports.despotismPenalty)(value, government, celebrating), government, celebrating);
exports.governmentTileYield = governmentTileYield;
exports.default = exports.governmentTileYield;
//# sourceMappingURL=governmentTileYield.js.map