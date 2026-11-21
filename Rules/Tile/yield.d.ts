import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TileYield from '@civ-clone/core-world/Rules/Yield';
/** The trade each Ocean square gives. */
export declare const OCEAN_TRADE: number;
/** The trade each River square gives. */
export declare const RIVER_TRADE: number;
/** The trade a Road adds on the terrains in `roadTradeTerrains`. */
export declare const ROAD_TRADE: number;
/** The terrains a Road adds `ROAD_TRADE` to. */
export declare const roadTradeTerrains: (typeof Terrain)[];
export declare const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => TileYield[];
export default getRules;
