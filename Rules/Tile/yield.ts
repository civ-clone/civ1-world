import {
  Coal,
  Fish,
  Game,
  Gems,
  Gold,
  Horse,
  Oasis,
  Oil,
  Seal,
  Shield,
} from '../../TerrainFeatures';
import {
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../../Terrains';
import { Food, Production, Trade } from '../../Yields';
import { Irrigation, Mine, Road } from '../../TileImprovements';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import TileYield from '@civ-clone/core-world/Rules/Yield';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => TileYield[] = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance
) => [
  ...(
    [
      [Food, Forest, 1],
      [Food, Grassland, 2],
      [Food, Hills, 1],
      [Food, Jungle, 1],
      [Food, Ocean, 1],
      [Food, Plains, 1],
      [Food, River, 2],
      [Food, Swamp, 1],
      [Food, Tundra, 1],
      [Production, Desert, 1],
      [Production, Forest, 2],
      [Production, Mountains, 1],
      [Production, Plains, 1],
    ] as [typeof Yield, typeof Terrain, number][]
  ).map(
    ([YieldType, TerrainType, value]: [typeof Yield, typeof Terrain, number]) =>
      new TileYield(
        new Criterion(
          (tile: Tile): boolean => tile.terrain() instanceof TerrainType
        ),
        new Effect((): Yield => new YieldType(value, TerrainType.name))
      )
  ),

  // The special resources' yields, which replace the terrain's in v474.05's table (`GameData.cs` L322-333): Coal is
  //  1/2/0 on Hills, Gold 0/1/6 on Mountains, and so on.
  ...(
    [
      [Production, Coal, 2],
      [Food, Fish, 2],
      [Food, Game, 2],
      [Trade, Gems, 4],
      [Trade, Gold, 6],
      [Production, Horse, 2],
      [Food, Oasis, 3],
      [Production, Oil, 4],
      [Food, Seal, 2],
      [Production, Shield, 1],
    ] as [typeof Yield, typeof TerrainFeature, number][]
  ).map(
    ([YieldType, Feature, value]: [
      typeof Yield,
      typeof TerrainFeature,
      number
    ]): TileYield =>
      new TileYield(
        new Criterion((tile: Tile): boolean =>
          terrainFeatureRegistry
            .getByTerrain(tile.terrain())
            .some(
              (feature: TerrainFeature): boolean => feature instanceof Feature
            )
        ),
        new Effect((): Yield => new YieldType(value, Feature.name))
      )
  ),

  new TileYield(
    new Criterion((tile: Tile): boolean => tile.terrain() instanceof Ocean),
    new Effect((): Yield => new Trade(2, Ocean.name))
  ),

  new TileYield(
    new Criterion((tile: Tile): boolean => tile.terrain() instanceof River),
    new Effect((): Yield => new Trade(1))
  ),

  // Irrigation and mines, as v474.05 applies them (`-1 - IrrigationEffect`, `-1 - MiningEffect` from `GameData.cs`
  //  L295-306), whatever the government: what Anarchy and Despotism take off is the tile modifier's
  //  (civ-clone/web-renderer#401).
  ...(
    [
      [Desert, Food, Irrigation, 1],
      [Desert, Production, Mine, 1],
      [Grassland, Food, Irrigation, 1],
      [Hills, Food, Irrigation, 1],
      [Hills, Production, Mine, 3],
      [Mountains, Production, Mine, 1],
      [Plains, Food, Irrigation, 1],
      [River, Food, Irrigation, 1],
    ] as [typeof Terrain, typeof Yield, typeof TileImprovement, number][]
  ).map(
    ([ImprovedTerrain, YieldType, Improvement, value]: [
      typeof Terrain,
      typeof Yield,
      typeof TileImprovement,
      number
    ]): TileYield =>
      new TileYield(
        new Criterion(
          (tile: Tile): boolean => tile.terrain() instanceof ImprovedTerrain
        ),
        new Criterion((tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Improvement
            )
        ),
        new Effect((): Yield => new YieldType(value, Improvement.name))
      )
  ),

  ...[Desert, Grassland, Plains].map(
    (TerrainType: typeof Terrain): TileYield =>
      new TileYield(
        new Criterion(
          (tile: Tile): boolean => tile.terrain() instanceof TerrainType
        ),
        new Criterion((tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Road
            )
        ),
        new Effect((): Yield => new Trade(1, Road.name))
      )
  ),
];

export default getRules;
