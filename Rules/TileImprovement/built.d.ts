import { Engine } from '@civ-clone/core-engine/Engine';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  engine?: Engine
) => Built[];
export default getRules;
