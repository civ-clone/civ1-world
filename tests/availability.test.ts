import {
  BridgeBuilding,
  Railroad as RailroadAdvance,
} from '@civ-clone/library-science/Advances';
import { Irrigation, Mine, Railroad, Road } from '../TileImprovements';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import available from '../Rules/TileImprovement/available';
import { expect } from 'chai';
import { generateFixedWorld } from './yield.test';

describe('tile-improvement:availability', async (): Promise<void> => {
  const ruleRegistry = new RuleRegistry(),
    world = await generateFixedWorld(
      new TerrainFeatureRegistry(),
      ruleRegistry
    ),
    player = new Player(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    playerResearch = new PlayerResearch(player),
    tileImprovementRegistry = new TileImprovementRegistry();

  playerResearchRegistry.register(playerResearch);

  ruleRegistry.register(
    ...available(playerResearchRegistry, tileImprovementRegistry)
  );

  const availabilityRules = ruleRegistry.get(Available);

  (
    [
      [
        Irrigation,
        [
          world.get(2, 0), // Desert
          world.get(6, 0), // Grassland
          world.get(8, 0), // Hills
          world.get(16, 0), // Plains
          world.get(18, 0), // River
        ],
        [
          world.get(0, 0), // Arctic
          world.get(4, 0), // Forest
          world.get(10, 0), // Jungle
          world.get(12, 0), // Mountains
          world.get(14, 0), // Ocean
          world.get(20, 0), // Swamp
          world.get(22, 0), // Tundra
        ],
      ],
      [
        Mine,
        [
          world.get(2, 0), // Desert
          world.get(8, 0), // Hills
          world.get(12, 0), // Mountains
        ],
        [
          world.get(0, 0), // Arctic
          world.get(4, 0), // Forest
          world.get(6, 0), // Grassland
          world.get(10, 0), // Jungle
          world.get(14, 0), // Ocean
          world.get(16, 0), // Plains
          world.get(18, 0), // River
          world.get(20, 0), // Swamp
          world.get(22, 0), // Tundra
        ],
      ],
      [
        Road,
        [
          world.get(0, 0), // Arctic
          world.get(2, 0), // Desert
          world.get(4, 0), // Forest
          world.get(6, 0), // Grassland
          world.get(8, 0), // Hills
          world.get(10, 0), // Jungle
          world.get(12, 0), // Mountains
          world.get(16, 0), // Plains
          world.get(20, 0), // Swamp
          world.get(22, 0), // Tundra
        ],
        [
          world.get(18, 0), // River
          world.get(14, 0), // Ocean
        ],
      ],
      [
        Road,
        [
          world.get(18, 0), // River
        ],
        [],
        () => playerResearch.addAdvance(BridgeBuilding),
        () => playerResearch.complete().pop(),
        ' once you have discovered BridgeBuilding',
      ],
      [
        Railroad,
        [],
        [
          world.get(0, 0), // Arctic
          world.get(2, 0), // Desert
          world.get(4, 0), // Forest
          world.get(6, 0), // Grassland
          world.get(8, 0), // Hills
          world.get(10, 0), // Jungle
          world.get(12, 0), // Mountains
          world.get(16, 0), // Plains
          world.get(18, 0), // River
          world.get(20, 0), // Swamp
          world.get(22, 0), // Tundra
          world.get(14, 0), // Ocean
        ],
        null,
        null,
        ' without discovering Railroad or an existing Road',
      ],
      [
        Railroad,
        [],
        [
          world.get(0, 0), // Arctic
          world.get(2, 0), // Desert
          world.get(4, 0), // Forest
          world.get(6, 0), // Grassland
          world.get(8, 0), // Hills
          world.get(10, 0), // Jungle
          world.get(12, 0), // Mountains
          world.get(16, 0), // Plains
          world.get(18, 0), // River
          world.get(20, 0), // Swamp
          world.get(22, 0), // Tundra
          world.get(14, 0), // Ocean
        ],
        () => playerResearch.addAdvance(RailroadAdvance),
        () => playerResearch.complete().pop(),
        ' without an existing Road',
      ],
      [
        Railroad,
        [],
        [
          world.get(0, 0), // Arctic
          world.get(2, 0), // Desert
          world.get(4, 0), // Forest
          world.get(6, 0), // Grassland
          world.get(8, 0), // Hills
          world.get(10, 0), // Jungle
          world.get(12, 0), // Mountains
          world.get(16, 0), // Plains
          world.get(18, 0), // River
          world.get(20, 0), // Swamp
          world.get(22, 0), // Tundra
          world.get(14, 0), // Ocean
        ],
        (tile: Tile) =>
          tileImprovementRegistry.register(new Road(tile, ruleRegistry)),
        (tile: Tile) =>
          tileImprovementRegistry.unregister(
            ...tileImprovementRegistry.getByTile(tile)
          ),
        ' without discovering Railroad',
      ],
      [
        Railroad,
        [
          world.get(0, 0), // Arctic
          world.get(2, 0), // Desert
          world.get(4, 0), // Forest
          world.get(6, 0), // Grassland
          world.get(8, 0), // Hills
          world.get(10, 0), // Jungle
          world.get(12, 0), // Mountains
          world.get(16, 0), // Plains
          world.get(18, 0), // River
          world.get(20, 0), // Swamp
          world.get(22, 0), // Tundra
        ],
        [
          world.get(14, 0), // Ocean
        ],
        (tile: Tile) => {
          tileImprovementRegistry.register(new Road(tile, ruleRegistry));

          playerResearch.addAdvance(RailroadAdvance);
        },
        (tile: Tile) => {
          tileImprovementRegistry.unregister(
            ...tileImprovementRegistry.getByTile(tile)
          );

          playerResearch.complete().pop();
        },
        ' once you have discovered Railroad and there is an existing Road',
      ],
    ] as [
      typeof TileImprovement,
      Tile[],
      Tile[],
      (tile: Tile) => void | null,
      (tile: Tile) => void | null,
      string
    ][]
  ).forEach(
    ([
      Improvement,
      availableTerrains,
      unavailableTerrains,
      setup,
      takeDown,
      message,
    ]: [
      typeof TileImprovement,
      Tile[],
      Tile[],
      (tile: Tile) => void | null,
      (tile: Tile) => void | null,
      string
    ]): void => {
      availableTerrains.forEach((tile: Tile): void => {
        it(`should be possible to build ${Improvement.name} on ${
          tile.terrain().constructor.name
        }${message ?? ''}`, (): void => {
          if (setup) {
            setup(tile);
          }

          expect(
            availabilityRules.some((rule: Available): boolean =>
              rule.validate(tile, Improvement, player)
            )
          ).to.true;

          if (takeDown) {
            takeDown(tile);
          }
        });
      });

      unavailableTerrains.forEach((tile: Tile): void => {
        it(`should not be possible to build ${Improvement.name} on ${
          tile.terrain().constructor.name
        }${message ?? ''}`, (): void => {
          if (setup) {
            setup(tile);
          }

          expect(
            availabilityRules.some((rule: Available): boolean =>
              rule.validate(tile, Improvement, player)
            )
          ).to.false;

          if (takeDown) {
            takeDown(tile);
          }
        });
      });
    }
  );
});
