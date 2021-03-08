import { Engine } from '@civ-clone/core-engine/Engine';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Pillaged from '@civ-clone/core-tile-improvement/Rules/Pillaged';
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  engine?: Engine
) => Pillaged[];
export default getRules;
