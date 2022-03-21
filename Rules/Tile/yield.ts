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
import { Irrigation, Mine, Railroad, Road } from '../../TileImprovements';
import {
  Communism,
  Democracy,
  Monarchy,
  Republic,
} from '@civ-clone/civ1-government/Governments';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
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
import { High } from '@civ-clone/core-rule/Priorities';
import Player from '@civ-clone/core-player/Player';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import TileYield from '@civ-clone/core-world/Rules/Yield';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  terrainFeatureRegistry?: TerrainFeatureRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => TileYield[] = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance
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
          (tileYield: Yield): boolean => tileYield instanceof YieldType
        ),
        new Criterion(
          (tileYield: Yield, tile: Tile): boolean =>
            tile.terrain() instanceof TerrainType
        ),
        new Effect((tileYield: Yield): void => tileYield.add(value))
      )
  ),

  ...(
    [
      [Production, Coal, 2],
      [Food, Fish, 1],
      [Food, Game, 1],
      [Trade, Gems, 2],
      [Trade, Gold, 3],
      [Production, Horse, 1],
      [Food, Oasis, 2],
      [Production, Oil, 3],
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
        new Criterion(
          (tileYield: Yield): boolean => tileYield instanceof YieldType
        ),
        new Criterion((tileYield: Yield, tile: Tile): boolean =>
          terrainFeatureRegistry
            .getByTerrain(tile.terrain())
            .some(
              (feature: TerrainFeature): boolean => feature instanceof Feature
            )
        ),
        new Effect((tileYield: Yield): void => tileYield.add(value))
      )
  ),

  ...(
    [
      [Production, Coal, 1],
      [Food, Fish, 1],
      [Food, Game, 1],
      [Trade, Gems, 2],
      [Trade, Gold, 2],
      [Production, Horse, 1],
      [Food, Oasis, 1],
      [Production, Oil, 1],
      [Food, Seal, 1],
    ] as [typeof Yield, typeof TerrainFeature, number][]
  ).map(
    ([YieldType, Feature, value]: [
      typeof Yield,
      typeof TerrainFeature,
      number
    ]): TileYield =>
      new TileYield(
        new Criterion(
          (tileYield: Yield, tile: Tile, player: Player): boolean => {
            try {
              return playerGovernmentRegistry
                .getByPlayer(player)
                .is(Communism, Democracy, Monarchy, Republic);
            } catch (e) {
              return false;
            }
          }
        ),
        new Criterion(
          (tileYield: Yield): boolean => tileYield instanceof YieldType
        ),
        new Criterion((tileYield: Yield, tile: Tile): boolean =>
          terrainFeatureRegistry
            .getByTerrain(tile.terrain())
            .some(
              (feature: TerrainFeature): boolean => feature instanceof Feature
            )
        ),
        new Effect((tileYield: Yield): void => tileYield.add(value))
      )
  ),

  new TileYield(
    new High(),
    new Criterion((tileYield: Yield): boolean => tileYield instanceof Trade),
    new Criterion(
      (tileYield: Yield, tile: Tile): boolean => tile.terrain() instanceof Ocean
    ),
    new Effect((tileYield: Yield): void => tileYield.add(2))
  ),

  new TileYield(
    new High(),
    new Criterion((tileYield: Yield): boolean => tileYield instanceof Trade),
    new Criterion(
      (tileYield: Yield, tile: Tile): boolean => tile.terrain() instanceof River
    ),
    new Effect((tileYield: Yield): void => tileYield.add(1))
  ),

  new TileYield(
    new High(),
    new Criterion((tileYield: Yield, tile: Tile, player: Player): boolean => {
      try {
        return playerGovernmentRegistry
          .getByPlayer(player)
          .is(Democracy, Republic);
      } catch (e) {
        return false;
      }
    }),
    new Criterion((tileYield: Yield): boolean => tileYield instanceof Trade),
    new Criterion(
      (tileYield: Yield, tile: Tile): boolean =>
        tile.terrain() instanceof River || tile.terrain() instanceof Ocean
    ),
    new Effect((tileYield: Yield): void => tileYield.add(1))
  ),

  ...(
    [
      [Desert, Food, Irrigation, 1],
      [Desert, Production, Mine, 1],
      [Hills, Food, Irrigation, 1],
      [Hills, Production, Mine, 2],
      [Mountains, Production, Mine, 2],
      [Plains, Food, Irrigation, 1],
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
          (tileYield: Yield): boolean => tileYield instanceof YieldType
        ),
        new Criterion(
          (tileYield: Yield, tile: Tile): boolean =>
            tile.terrain() instanceof ImprovedTerrain
        ),
        new Criterion((tileYield: Yield, tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Improvement
            )
        ),
        new Effect((tileYield: Yield): void => tileYield.add(value))
      )
  ),

  ...(
    [
      [Desert, Production, Mine, 1],
      [Grassland, Food, Irrigation, 1],
      [Hills, Production, Mine, 1],
      [Mountains, Production, Mine, 1],
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
          (tileYield: Yield, tile: Tile, player: Player): boolean => {
            try {
              return playerGovernmentRegistry
                .getByPlayer(player)
                .is(Communism, Democracy, Monarchy, Republic);
            } catch (e) {
              return false;
            }
          }
        ),
        new Criterion(
          (tileYield: Yield): boolean => tileYield instanceof YieldType
        ),
        new Criterion(
          (tileYield: Yield, tile: Tile): boolean =>
            tile.terrain() instanceof ImprovedTerrain
        ),
        new Criterion((tileYield: Yield, tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Improvement
            )
        ),
        new Effect((tileYield: Yield): void => tileYield.add(value))
      )
  ),

  ...[Desert, Grassland, Plains].map(
    (TerrainType: typeof Terrain): TileYield =>
      new TileYield(
        new High(),
        new Criterion(
          (tileYield: Yield): boolean => tileYield instanceof Trade
        ),
        new Criterion(
          (tileYield: Yield, tile: Tile): boolean =>
            tile.terrain() instanceof TerrainType
        ),
        new Criterion((tileYield: Yield, tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Road
            )
        ),
        new Effect((tileYield: Yield): void => tileYield.add(1))
      )
  ),

  ...[Desert, Grassland, Plains].map(
    (TerrainType: typeof Terrain): TileYield =>
      new TileYield(
        new High(),
        new Criterion(
          (tileYield: Yield, tile: Tile, player: Player): boolean => {
            try {
              return playerGovernmentRegistry
                .getByPlayer(player)
                .is(Democracy, Republic);
            } catch (e) {
              return false;
            }
          }
        ),
        new Criterion(
          (tileYield: Yield): boolean => tileYield instanceof Trade
        ),
        new Criterion(
          (tileYield: Yield, tile: Tile): boolean =>
            tile.terrain() instanceof TerrainType
        ),
        new Criterion((tileYield: Yield, tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Road
            )
        ),
        new Effect((tileYield: Yield): void => tileYield.add(1))
      )
  ),

  new TileYield(
    new Criterion((tileYield: Yield, tile: Tile): boolean =>
      tileImprovementRegistry
        .getByTile(tile)
        .some(
          (improvement: TileImprovement): boolean =>
            improvement instanceof Railroad
        )
    ),
    new Effect((tileYield: Yield): void =>
      tileYield.add(Math.floor(tileYield.value() * 0.5), Railroad.name)
    )
  ),
];

export default getRules;
