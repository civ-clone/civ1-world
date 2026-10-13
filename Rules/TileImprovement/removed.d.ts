import { Engine } from '@civ-clone/core-engine/Engine';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  engine?: Engine
) => Removed[];
export default getRules;
