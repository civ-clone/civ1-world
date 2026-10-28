import { PlayerGovernmentRegistry } from '@civ-clone/core-government/PlayerGovernmentRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import YieldModifier from '@civ-clone/core-world/Rules/YieldModifier';
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => YieldModifier[];
export default getRules;
