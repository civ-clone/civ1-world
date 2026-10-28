import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import Yield from '@civ-clone/core-yield/Yield';
export declare const DESPOTISM_PENALTY = 'civ1-world:despotism-penalty';
export declare const TRADE_BONUS = 'civ1-world:trade-bonus';
export declare const governmentTileYieldTypes: (typeof Yield)[];
/**
 * Step 1 of what the government does to one of a square's yields, after the railroad (v474.05 `CityWorker.cs`
 *  `F0_1d12_6abc_GetCityResourceCount`, L4102-4113, civ-clone/web-renderer#401): under Anarchy and Despotism, a yield
 *  of more than 2 loses 1, unless the city is celebrating.
 */
export declare const despotismPenalty: (
  value: number,
  government: PlayerGovernment | null,
  celebrating?: boolean
) => number;
/**
 * Step 2, on what step 1 left (L4115-4134): trade, if there is any, gains 1 under The Republic and Democracy, or, while
 *  the city celebrates, under Monarchy and Communism too.
 */
export declare const tradeBonus: (
  YieldType: typeof Yield,
  value: number,
  government: PlayerGovernment | null,
  celebrating?: boolean
) => number;
/**
 * Both steps, before pollution halves the result. `value` is the yield after the railroad. A tile's own yields are
 *  worked out for a city that isn't celebrating; a celebrating city adds the difference.
 */
export declare const governmentTileYield: (
  YieldType: typeof Yield,
  value: number,
  government: PlayerGovernment | null,
  celebrating?: boolean
) => number;
export default governmentTileYield;
