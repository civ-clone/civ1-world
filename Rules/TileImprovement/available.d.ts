import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  tileImprovementRegistry?: TileImprovementRegistry
) => Available[];
export default getRules;
