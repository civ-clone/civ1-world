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
  Irrigation,
  Mine,
  Pollution,
  Railroad,
  Road,
} from '../TileImprovements';
import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Monarchy,
  Republic,
} from '@civ-clone/library-government/Governments';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import AvailableGovernmentRegistry from '@civ-clone/core-government/AvailableGovernmentRegistry';
import Government from '@civ-clone/core-government/Government';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import Loader from '@civ-clone/simple-world-generator/tests/lib/Loader';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import World from '@civ-clone/core-world/World';
import Yield from '@civ-clone/core-yield/Yield';
import { expect } from 'chai';
import tileYield from '../Rules/Tile/yield';
import tileYieldModifier from '../Rules/Tile/yield-modifier';

export const generateFixedWorld = (
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Promise<World> => {
  const terrains: [typeof Terrain, ...(typeof TerrainFeature)[]][] = [
      [Arctic],
      [Arctic, Seal],
      [Desert],
      [Desert, Oasis],
      [Forest],
      [Forest, Game],
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
      [Plains, Horse],
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
            ...(typeof TerrainFeature)[]
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
      ),
      ruleRegistry
    );

  return world.build();
};

describe('tile:yield', async (): Promise<void> => {
  const ruleRegistry = new RuleRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    world = await generateFixedWorld(terrainFeatureRegistry, ruleRegistry),
    player = new Player(ruleRegistry);

  ruleRegistry.register(
    ...tileYield(tileImprovementRegistry, terrainFeatureRegistry),
    ...tileYieldModifier(tileImprovementRegistry)
  );

  const expectedData = (
    [
      // Food, Production, Trade
      // [Arctic],
      [0, 0, 0],
      // [Arctic, Seal],
      [2, 0, 0],
      // [Desert],
      [0, 1, 0],
      // [Desert, Oasis],
      [3, 1, 0],
      // [Forest],
      [1, 2, 0],
      // [Forest, Game],
      [3, 2, 0],
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
      [1, 0, 4],
      // [Mountains],
      [0, 1, 0],
      // [Mountains, Gold],
      [0, 1, 6],
      // [Ocean],
      [1, 0, 2],
      // [Ocean, Fish],
      [3, 0, 2],
      // [Plains],
      [1, 1, 0],
      // [Plains, Horse],
      [1, 3, 0],
      // [River],
      [2, 0, 1],
      // [River, Shield],
      [2, 1, 1],
      // [Swamp],
      [1, 0, 0],
      // [Swamp, Oil],
      [1, 4, 0],
      // [Tundra],
      [1, 0, 0],
      // [Tundra, Game],
      [3, 0, 0],
    ] as [number, number, number][]
  ).map(
    ([food, production, trade]: [number, number, number]): [
      typeof Yield,
      number
    ][] => [
      [Food, food],
      [Production, production],
      [Trade, trade],
    ]
  );

  expectedData.forEach((expectedValues, i) => {
    expectedValues.forEach(([YieldType, expectedValue]) => {
      const tile = world.get(i, 0),
        value = tile
          .yields(new Player())
          .filter((tileYield) => tileYield instanceof YieldType)
          .reduce((total, tileYield) => total + tileYield.value(), 0),
        terrain = tile.terrain(),
        features = terrainFeatureRegistry.getByTerrain(terrain);

      it(`${tile.terrain().constructor.name}${
        features.length
          ? ` (${features.map((feature) => feature.constructor.name).join('')})`
          : ''
      } should yield ${expectedValue} ${YieldType.name}`, () =>
        expect(value).to.equal(expectedValue));
    });
  });

  (
    [
      [
        [Irrigation],
        [world.get(2, 0), Food, 1], // Desert
        [world.get(3, 0), Food, 4], // Desert - Oasis
        [world.get(6, 0), Food, 3], // Grassland
        [world.get(7, 0), Food, 3], // Grassland - Shield
        [world.get(8, 0), Food, 2], // Hills
        [world.get(9, 0), Food, 2], // Hills - Coal
        [world.get(16, 0), Food, 2], // Plains
        [world.get(17, 0), Food, 2], // Plains - Horse
        [world.get(18, 0), Food, 3], // River
        [world.get(19, 0), Food, 3], // River - Shield
      ],
      [
        [Mine],
        [world.get(2, 0), Production, 2], // Desert
        [world.get(3, 0), Production, 2], // Desert - Oasis
        [world.get(8, 0), Production, 3], // Hills
        [world.get(9, 0), Production, 5], // Hills - Coal
        [world.get(12, 0), Production, 2], // Mountains
        [world.get(13, 0), Production, 2], // Mountains - Gold
      ],
      [
        [Road],
        [world.get(0, 0), Trade, 0], // Arctic
        [world.get(1, 0), Trade, 0], // Arctic - Seal
        [world.get(2, 0), Trade, 1], // Desert
        [world.get(3, 0), Trade, 1], // Desert - Oasis
        [world.get(4, 0), Trade, 0], // Forest
        [world.get(4, 0), Trade, 0], // Forest - Game
        [world.get(6, 0), Trade, 1], // Grassland
        [world.get(7, 0), Trade, 1], // Grassland - Shield
        [world.get(8, 0), Trade, 0], // Hills
        [world.get(9, 0), Trade, 0], // Hills - Coal
        [world.get(10, 0), Trade, 0], // Jungle
        [world.get(11, 0), Trade, 4], // Jungle - Gems
        [world.get(12, 0), Trade, 0], // Mountains
        [world.get(13, 0), Trade, 6], // Mountains - Gold
        [world.get(16, 0), Trade, 1], // Plains
        [world.get(17, 0), Trade, 1], // Plains - Horse
        [world.get(18, 0), Trade, 1], // River
        [world.get(19, 0), Trade, 1], // River - Shield
        [world.get(20, 0), Trade, 0], // Swamp
        [world.get(21, 0), Trade, 0], // Swamp - Oil
        [world.get(22, 0), Trade, 0], // Tundra
        [world.get(23, 0), Trade, 0], // Tundra - Game
      ],
      [
        [Road, Railroad],
        [world.get(0, 0), Food, 0], // Arctic
        [world.get(1, 0), Food, 3], // Arctic - Seal
        [world.get(2, 0), Food, 0], // Desert
        [world.get(3, 0), Food, 4], // Desert - Oasis
        [world.get(4, 0), Food, 1], // Forest
        [world.get(5, 0), Food, 4], // Forest - Game
        [world.get(6, 0), Food, 3], // Grassland
        [world.get(7, 0), Food, 3], // Grassland - Shield
        [world.get(8, 0), Food, 1], // Hills
        [world.get(9, 0), Food, 1], // Hills - Coal
        [world.get(10, 0), Food, 1], // Jungle
        [world.get(11, 0), Food, 1], // Jungle - Gems
        [world.get(12, 0), Food, 0], // Mountains
        [world.get(13, 0), Food, 0], // Mountains - Gold
        [world.get(16, 0), Food, 1], // Plains
        [world.get(17, 0), Food, 1], // Plains - Horse
        [world.get(18, 0), Food, 3], // River
        [world.get(19, 0), Food, 3], // River - Shield
        [world.get(20, 0), Food, 1], // Swamp
        [world.get(21, 0), Food, 1], // Swamp - Oil
        [world.get(22, 0), Food, 1], // Tundra
        [world.get(23, 0), Food, 4], // Tundra - Game

        [world.get(0, 0), Production, 0], // Arctic
        [world.get(1, 0), Production, 0], // Arctic - Seal
        [world.get(2, 0), Production, 1], // Desert
        [world.get(3, 0), Production, 1], // Desert - Oasis
        [world.get(4, 0), Production, 3], // Forest
        [world.get(5, 0), Production, 3], // Forest - Game
        [world.get(6, 0), Production, 0], // Grassland
        [world.get(7, 0), Production, 1], // Grassland - Shield
        [world.get(8, 0), Production, 0], // Hills
        [world.get(9, 0), Production, 3], // Hills - Coal
        [world.get(10, 0), Production, 0], // Jungle
        [world.get(11, 0), Production, 0], // Jungle - Gems
        [world.get(12, 0), Production, 1], // Mountains
        [world.get(13, 0), Production, 1], // Mountains - Gold
        [world.get(16, 0), Production, 1], // Plains
        [world.get(17, 0), Production, 4], // Plains - Horse
        [world.get(18, 0), Production, 0], // River
        [world.get(19, 0), Production, 1], // River - Shield
        [world.get(20, 0), Production, 0], // Swamp
        [world.get(21, 0), Production, 6], // Swamp - Oil
        [world.get(22, 0), Production, 0], // Tundra
        [world.get(23, 0), Production, 0], // Tundra - Game

        [world.get(0, 0), Trade, 0], // Arctic
        [world.get(1, 0), Trade, 0], // Arctic - Seal
        [world.get(2, 0), Trade, 1], // Desert
        [world.get(3, 0), Trade, 1], // Desert - Oasis
        [world.get(4, 0), Trade, 0], // Forest
        [world.get(5, 0), Trade, 0], // Forest - Game
        [world.get(6, 0), Trade, 1], // Grassland
        [world.get(7, 0), Trade, 1], // Grassland - Shield
        [world.get(8, 0), Trade, 0], // Hills
        [world.get(9, 0), Trade, 0], // Hills - Coal
        [world.get(10, 0), Trade, 0], // Jungle
        [world.get(11, 0), Trade, 6], // Jungle - Gems
        [world.get(12, 0), Trade, 0], // Mountains
        [world.get(13, 0), Trade, 9], // Mountains - Gold
        [world.get(16, 0), Trade, 1], // Plains
        [world.get(17, 0), Trade, 1], // Plains - Horse
        [world.get(18, 0), Trade, 1], // River
        [world.get(19, 0), Trade, 1], // River - Shield
        [world.get(20, 0), Trade, 0], // Swamp
        [world.get(21, 0), Trade, 0], // Swamp - Oil
        [world.get(22, 0), Trade, 0], // Tundra
        [world.get(23, 0), Trade, 0], // Tundra - Game
      ],
      [
        [Irrigation, Road, Railroad],
        [world.get(2, 0), Food, 1], // Desert
        [world.get(3, 0), Food, 6], // Desert - Oasis
        [world.get(6, 0), Food, 4], // Grassland
        [world.get(7, 0), Food, 4], // Grassland - Shield
        [world.get(8, 0), Food, 3], // Hills
        [world.get(9, 0), Food, 3], // Hills - Coal
        [world.get(16, 0), Food, 3], // Plains
        [world.get(17, 0), Food, 3], // Plains - Horse
        [world.get(18, 0), Food, 4], // River
        [world.get(19, 0), Food, 4], // River - Shield

        [world.get(2, 0), Trade, 1], // Desert
        [world.get(3, 0), Trade, 1], // Desert - Oasis
        [world.get(6, 0), Trade, 1], // Grassland
        [world.get(7, 0), Trade, 1], // Grassland - Shield
        [world.get(8, 0), Trade, 0], // Hills
        [world.get(9, 0), Trade, 0], // Hills - Coal
        [world.get(16, 0), Trade, 1], // Plains
        [world.get(17, 0), Trade, 1], // Plains - Horse
        [world.get(18, 0), Trade, 1], // River
        [world.get(19, 0), Trade, 1], // River - Shield
      ],
      [
        [Mine, Road, Railroad],
        [world.get(2, 0), Production, 3], // Desert
        [world.get(3, 0), Production, 3], // Desert - Oasis
        [world.get(8, 0), Production, 4], // Hills
        [world.get(9, 0), Production, 7], // Hills - Coal
        [world.get(12, 0), Production, 3], // Mountains
        [world.get(13, 0), Production, 3], // Mountains - Gold
      ],
      // Pollution halves each yield, rounded up, after everything else (civ-clone/web-renderer#32).
      [
        [Pollution],
        [world.get(0, 0), Food, 0], // Arctic
        [world.get(6, 0), Food, 1], // Grassland
        [world.get(9, 0), Production, 1], // Hills - Coal
        [world.get(11, 0), Trade, 2], // Jungle - Gems
        [world.get(13, 0), Trade, 3], // Mountains - Gold
        [world.get(15, 0), Food, 2], // Ocean - Fish
        [world.get(21, 0), Production, 2], // Swamp - Oil
      ],
      [
        [Irrigation, Pollution],
        [world.get(3, 0), Food, 2], // Desert - Oasis
      ],
      [
        [Mine, Road, Railroad, Pollution],
        [world.get(9, 0), Production, 4], // Hills - Coal
      ],
    ] as [(typeof TileImprovement)[], ...[Tile, typeof Yield, number][]][]
  ).forEach(
    ([improvements, ...values]: [
      (typeof TileImprovement)[],
      ...[Tile, typeof Yield, number][]
    ]): void => {
      values.forEach(
        ([tile, YieldType, expectedValue]: [
          Tile,
          typeof Yield,
          number
        ]): void => {
          const terrain = tile.terrain(),
            features = terrainFeatureRegistry.getByTerrain(terrain);

          it(`${tile.terrain().constructor.name}${
            features.length
              ? ` (${features
                  .map((feature) => feature.constructor.name)
                  .join('')})`
              : ''
          } with ${improvements
            .map((Improvement) => Improvement.name)
            .join(', ')} should yield ${expectedValue} ${
            YieldType.name
          }`, (): void => {
            const tileImprovements = improvements.map(
              (Improvement) => new Improvement(tile, ruleRegistry)
            );

            tileImprovementRegistry.register(...tileImprovements);

            tile.clearYieldCache(player);

            const tileYield = tile
              .yields(player)
              .filter((tileYield) => tileYield instanceof YieldType)
              .reduce((total, tileYield) => total + tileYield.value(), 0);

            expect(tileYield).to.equal(expectedValue);

            tileImprovementRegistry.unregister(...tileImprovements);
          });
        }
      );
    }
  );
});

// v474.05 `CityWorker.cs` L4102-4134 (civ-clone/web-renderer#401): Anarchy and Despotism take 1 off a yield of more
//  than 2, after the railroad; The Republic and Democracy add 1 to any trade; pollution then halves what's left.
describe('tile:yield under a government', async (): Promise<void> => {
  const ruleRegistry = new RuleRegistry(),
    terrainFeatureRegistry = new TerrainFeatureRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    world = await generateFixedWorld(terrainFeatureRegistry, ruleRegistry),
    playerWith = (GovernmentType: typeof Government): Player => {
      const player = new Player(ruleRegistry),
        playerGovernment = new PlayerGovernment(
          player,
          new AvailableGovernmentRegistry(),
          ruleRegistry
        );

      playerGovernmentRegistry.register(playerGovernment);
      playerGovernment.set(new GovernmentType());

      return player;
    };

  ruleRegistry.register(
    ...tileYield(tileImprovementRegistry, terrainFeatureRegistry),
    ...tileYieldModifier(tileImprovementRegistry, playerGovernmentRegistry)
  );

  (
    [
      [Despotism, [Irrigation], world.get(6, 0), Food, 2], // Grassland
      [Despotism, [], world.get(3, 0), Food, 2], // Desert - Oasis
      [Despotism, [], world.get(9, 0), Production, 2], // Hills - Coal
      [Despotism, [Mine], world.get(8, 0), Production, 2], // Hills
      [Despotism, [], world.get(11, 0), Trade, 3], // Jungle - Gems
      [Despotism, [], world.get(13, 0), Trade, 5], // Mountains - Gold
      [Despotism, [], world.get(14, 0), Trade, 2], // Ocean
      [Despotism, [], world.get(15, 0), Food, 2], // Ocean - Fish
      [Despotism, [Irrigation, Road, Railroad], world.get(6, 0), Food, 3], // Grassland
      [Despotism, [Pollution], world.get(21, 0), Production, 2], // Swamp - Oil
      [Anarchy, [Irrigation], world.get(6, 0), Food, 2], // Grassland
      [Anarchy, [], world.get(13, 0), Trade, 5], // Mountains - Gold
      [Monarchy, [Irrigation], world.get(6, 0), Food, 3], // Grassland
      [Monarchy, [], world.get(13, 0), Trade, 6], // Mountains - Gold
      [Monarchy, [], world.get(14, 0), Trade, 2], // Ocean
      [Communism, [], world.get(14, 0), Trade, 2], // Ocean
      [Republic, [], world.get(14, 0), Trade, 3], // Ocean
      [Republic, [], world.get(13, 0), Trade, 7], // Mountains - Gold
      [Republic, [], world.get(18, 0), Trade, 2], // River
      [Republic, [], world.get(6, 0), Trade, 0], // Grassland
      [Republic, [Road], world.get(6, 0), Trade, 2], // Grassland
      [Republic, [Pollution], world.get(13, 0), Trade, 4], // Mountains - Gold
      [Democracy, [], world.get(14, 0), Trade, 3], // Ocean
      [Democracy, [Irrigation], world.get(6, 0), Food, 3], // Grassland
    ] as [
      typeof Government,
      (typeof TileImprovement)[],
      Tile,
      typeof Yield,
      number
    ][]
  ).forEach(
    ([GovernmentType, improvements, tile, YieldType, expectedValue]): void => {
      const features = terrainFeatureRegistry.getByTerrain(tile.terrain());

      it(`${tile.terrain().constructor.name}${
        features.length
          ? ` (${features.map((feature) => feature.constructor.name).join('')})`
          : ''
      }${
        improvements.length
          ? ` with ${improvements
              .map((Improvement) => Improvement.name)
              .join(', ')}`
          : ''
      } should yield ${expectedValue} ${YieldType.name} under ${
        GovernmentType.name
      }`, (): void => {
        const player = playerWith(GovernmentType),
          tileImprovements = improvements.map(
            (Improvement) => new Improvement(tile, ruleRegistry)
          );

        tileImprovementRegistry.register(...tileImprovements);

        const tileYield = tile
          .yields(player)
          .filter((tileYield) => tileYield instanceof YieldType)
          .reduce((total, tileYield) => total + tileYield.value(), 0);

        expect(tileYield).to.equal(expectedValue);

        tileImprovementRegistry.unregister(...tileImprovements);
      });
    }
  );
});
