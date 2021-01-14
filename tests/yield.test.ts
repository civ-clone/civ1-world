import {
  Arctic,
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
} from '../Terrains';
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
} from '../TerrainFeatures';
import { Food, Production, Trade } from '../Yields';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Player from '@civ-clone/core-player/Player';
import Loader from '@civ-clone/base-world-generator/tests/lib/Loader';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import World from '@civ-clone/core-world/World';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRegistry from '@civ-clone/core-yield/YieldRegistry';
import { expect } from 'chai';
import tileYield from '../Rules/Tile/yield';
import { Irrigation, Mine, Road } from '../TileImprovements';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Tile from '@civ-clone/core-world/Tile';

export const generateFixedWorld = (
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): World => {
  const terrains: [typeof Terrain, ...typeof TerrainFeature[]][] = [
      [Arctic],
      [Arctic, Seal],
      [Desert],
      [Desert, Oasis],
      [Forest],
      [Forest, Horse],
      [Grassland],
      [Grassland, Shield],
      [Hills],
      [Hills, Coal],
      [Jungle],
      [Jungle, Gems],
      [Mountains],
      [Mountains, Gold],
      [Ocean],
      [Ocean, Fish],
      [Plains],
      [Plains, Game],
      [River],
      [River, Shield],
      [Swamp],
      [Swamp, Oil],
      [Tundra],
      [Tundra, Game],
    ],
    world = new World(
      new Loader(
        1,
        24,
        terrains.map(
          ([TerrainType, ...features]: [
            typeof Terrain,
            ...typeof TerrainFeature[]
          ]): [Terrain, ...TerrainFeature[]] => {
            const terrain = new TerrainType();

            return [
              terrain,
              ...features.map(
                (Feature: typeof TerrainFeature) => new Feature(terrain)
              ),
            ];
          }
        ),
        terrainFeatureRegistry
      )
    );

  world.build(ruleRegistry);

  return world;
};

describe('tile:yield', (): void => {
  const ruleRegistry = new RuleRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    yieldRegistry = new YieldRegistry(),
    world = generateFixedWorld(terrainFeatureRegistry, ruleRegistry),
    player = new Player(ruleRegistry);

  ruleRegistry.register(
    ...tileYield(tileImprovementRegistry, terrainFeatureRegistry)
  );

  const expectedData = ([
    // Food, Production, Trade
    // [Arctic],
    [0, 0, 0],
    // [Arctic, Seal],
    [2, 0, 0],
    // [Desert],
    [0, 1, 0],
    // [Desert, Oasis],
    [2, 1, 0],
    // [Forest],
    [1, 2, 0],
    // [Forest, Horse],
    [2, 2, 0],
    // [Grassland],
    [2, 0, 0],
    // [Grassland, Shield],
    [2, 1, 0],
    // [Hills],
    [1, 0, 0],
    // [Hills, Coal],
    [1, 2, 0],
    // [Jungle],
    [1, 0, 0],
    // [Jungle, Gems],
    [1, 0, 2],
    // [Mountains],
    [0, 1, 0],
    // [Mountains, Gold],
    [0, 1, 3],
    // [Ocean],
    [1, 0, 2],
    // [Ocean, Fish],
    [2, 0, 2],
    // [Plains],
    [1, 1, 0],
    // [Plains, Game],
    [1, 2, 0],
    // [River],
    [2, 0, 1],
    // [River, Shield],
    [2, 1, 1],
    // [Swamp],
    [1, 0, 0],
    // [Swamp, Oil],
    [1, 3, 0],
    // [Tundra],
    [1, 0, 0],
    // [Tundra, Game],
    [2, 0, 0],
  ] as [number, number, number][]).map(
    ([food, production, trade]: [number, number, number]): [
      typeof Yield,
      number
    ][] => [
      [Food, food],
      [Production, production],
      [Trade, trade],
    ]
  );

  for (let i = 0; i < 24; i++) {
    const tile = world.get(i, 0),
      yields = tile.yields(new Player(), [Food, Production, Trade]),
      terrain = tile.terrain(),
      features = terrainFeatureRegistry.getByTerrain(terrain);

    yields.forEach((tileYield: Yield): void => {
      const [expectedValue] = expectedData[i]
        .filter(
          ([YieldType]: [typeof Yield, number]): boolean =>
            tileYield instanceof YieldType
        )
        .map(([, value]: [typeof Yield, number]): number => value);

      it(`${tile.terrain().constructor.name}${
        features.length
          ? ` (${features.map((feature) => feature.constructor.name).join('')})`
          : ''
      } should yield ${expectedValue} ${tileYield.constructor.name}`, () => {
        expect(tileYield.value()).to.equal(expectedValue);
      });
    });
  }

  ([
    [
      Irrigation,
      [world.get(2, 0), Food, 1], // Desert
      [world.get(3, 0), Food, 3], // Desert
      [world.get(6, 0), Food, 2], // Grassland
      [world.get(8, 0), Food, 2], // Hills
      [world.get(16, 0), Food, 2], // Plains
      [world.get(18, 0), Food, 2], // River
    ],
    [
      Mine,
      [world.get(2, 0), Production, 2], // Desert
      [world.get(8, 0), Production, 2], // Hills
      [world.get(9, 0), Production, 4], // Hills
      [world.get(12, 0), Production, 3], // Mountains
    ],
    [
      Road,
      [world.get(0, 0), Trade, 0], // Arctic
      [world.get(2, 0), Trade, 1], // Desert
      [world.get(4, 0), Trade, 0], // Forest
      [world.get(6, 0), Trade, 1], // Grassland
      [world.get(8, 0), Trade, 0], // Hills
      [world.get(10, 0), Trade, 0], // Jungle
      [world.get(12, 0), Trade, 0], // Mountains
      [world.get(13, 0), Trade, 3], // Mountains
      [world.get(16, 0), Trade, 1], // Plains
      [world.get(20, 0), Trade, 0], // Swamp
      [world.get(22, 0), Trade, 0], // Tundra
    ],
  ] as [typeof TileImprovement, ...[Tile, typeof Yield, number][]][]).forEach(
    ([Improvement, ...values]: [
      typeof TileImprovement,
      ...[Tile, typeof Yield, number][]
    ]): void => {
      values.forEach(
        ([tile, YieldType, expectedValue]: [
          Tile,
          typeof Yield,
          number
        ]): void => {
          const improvement = new Improvement(tile, ruleRegistry),
            terrain = tile.terrain(),
            features = terrainFeatureRegistry.getByTerrain(terrain);

          it(`${tile.terrain().constructor.name}${
            features.length
              ? ` (${features
                  .map((feature) => feature.constructor.name)
                  .join('')})`
              : ''
          } with ${Improvement.name} should yield ${expectedValue} ${
            YieldType.name
          }`, (): void => {
            tileImprovementRegistry.register(improvement);

            const [tileYield] = tile.yields(player, [YieldType], yieldRegistry);

            expect(tileYield.value()).to.equal(expectedValue);

            tileImprovementRegistry.unregister(improvement);
          });
        }
      );
    }
  );
});
