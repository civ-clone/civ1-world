import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import TileYield from '@civ-clone/core-world/Rules/Yield';
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => TileYield[];
export default getRules;
