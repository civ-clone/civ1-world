import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Monarchy,
  Republic,
} from '@civ-clone/library-government/Governments';
import { Food, Production, Trade } from '../Yields';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import Yield from '@civ-clone/core-yield/Yield';

// The providers of the yields the government's steps add to a tile, so a city can tell them from the tile's own.
export const DESPOTISM_PENALTY = 'civ1-world:despotism-penalty';
export const TRADE_BONUS = 'civ1-world:trade-bonus';

export const governmentTileYieldTypes: (typeof Yield)[] = [
  Food,
  Production,
  Trade,
];

/**
 * Step 1 of what the government does to one of a square's yields, after the railroad (v474.05 `CityWorker.cs`
 *  `F0_1d12_6abc_GetCityResourceCount`, L4102-4113, civ-clone/web-renderer#401): under Anarchy and Despotism, a yield
 *  of more than 2 loses 1, unless the city is celebrating.
 */
export const despotismPenalty = (
  value: number,
  government: PlayerGovernment | null,
  celebrating: boolean = false
): number =>
  value > 2 && !celebrating && government?.is(Anarchy, Despotism)
    ? value - 1
    : value;

/**
 * Step 2, on what step 1 left (L4115-4134): trade, if there is any, gains 1 under The Republic and Democracy, or, while
 *  the city celebrates, under Monarchy and Communism too.
 */
export const tradeBonus = (
  YieldType: typeof Yield,
  value: number,
  government: PlayerGovernment | null,
  celebrating: boolean = false
): number =>
  value > 0 &&
  YieldType === Trade &&
  government !== null &&
  (celebrating
    ? government.is(Communism, Democracy, Monarchy, Republic)
    : government.is(Democracy, Republic))
    ? value + 1
    : value;

/**
 * Both steps, before pollution halves the result. `value` is the yield after the railroad. A tile's own yields are
 *  worked out for a city that isn't celebrating; a celebrating city adds the difference.
 */
export const governmentTileYield = (
  YieldType: typeof Yield,
  value: number,
  government: PlayerGovernment | null,
  celebrating: boolean = false
): number =>
  tradeBonus(
    YieldType,
    despotismPenalty(value, government, celebrating),
    government,
    celebrating
  );

export default governmentTileYield;
