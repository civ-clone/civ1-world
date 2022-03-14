import {
  Available,
  IAvailableRegistry,
} from '@civ-clone/core-tile-improvement/Rules/Available';
import { Irrigation, Mine, Railroad, Road } from '../TileImprovements';
import Advance from '@civ-clone/core-science/Advance';
import { BridgeBuilding } from '@civ-clone/civ1-science/Advances';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import { Railroad as RailroadAdvance } from '@civ-clone/civ1-science/Advances';
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

  const availabilityRules = (ruleRegistry as IAvailableRegistry).get(Available);

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
          world.get(14, 0), // Ocean
        ],
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
      ],
    ] as [
      typeof TileImprovement,
      Tile[],
      Tile[],
      (tile: Tile) => void | undefined
    ][]
  ).forEach(
    ([Improvement, availableTerrains, unavailableTerrains, setup]: [
      typeof TileImprovement,
      Tile[],
      Tile[],
      (tile: Tile) => void | undefined
    ]): void => {
      availableTerrains.forEach((tile: Tile): void => {
        it(`should be possible to build ${Improvement.name} on ${
          tile.terrain().constructor.name
        }`, (): void => {
          if (setup) {
            setup(tile);
          }

          expect(
            availabilityRules.some((rule: Available): boolean =>
              rule.validate(tile, Improvement, player)
            )
          ).to.true;
        });
      });

      unavailableTerrains.forEach((tile: Tile): void => {
        it(`should not be possible to build ${Improvement.name} on ${
          tile.terrain().constructor.name
        }`, (): void => {
          expect(
            availabilityRules.some((rule: Available): boolean =>
              rule.validate(tile, Improvement, player)
            )
          ).to.false;
        });
      });
    }
  );

  (
    [
      [Road, world.get(18, 0), BridgeBuilding], // River
    ] as [typeof TileImprovement, Tile, typeof Advance][]
  ).forEach(
    ([Improvement, tile, RequiredAdvance]: [
      typeof TileImprovement,
      Tile,
      typeof Advance
    ]) => {
      it(`should not be possible to build ${Improvement.name} on ${
        tile.terrain().constructor.name
      } without discovering ${RequiredAdvance.name}`, (): void => {
        expect(
          availabilityRules.some((rule: Available): boolean =>
            rule.validate(tile, Improvement, player)
          )
        ).to.false;
      });

      it(`should be possible to build ${Improvement.name} on ${
        tile.terrain().constructor.name
      } once discovered ${RequiredAdvance.name}`, (): void => {
        playerResearch.addAdvance(RequiredAdvance);

        expect(
          availabilityRules.some((rule: Available): boolean =>
            rule.validate(tile, Improvement, player)
          )
        ).to.true;

        playerResearch.complete().pop();
      });
    }
  );
});
