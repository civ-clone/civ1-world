import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import YieldModifier from '@civ-clone/core-world/Rules/YieldModifier';
/** What a Railroad adds to each of a square's yields, as a share of what the square already gives (rounded down). */
export declare const RAILROAD_BONUS: number;
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => YieldModifier[];
export default getRules;
