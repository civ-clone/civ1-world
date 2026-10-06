import { Grassland, Ocean } from '../Terrains';
import Engine from '@civ-clone/core-engine/Engine';
import LandMassRegistry from '@civ-clone/core-world/LandMassRegistry';
import Loader from '@civ-clone/simple-world-generator/tests/lib/Loader';
import Player from '@civ-clone/core-player/Player';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import civ1Distance from '../lib/civ1Distance';
import { expect } from 'chai';
import pickStartTile from '../Rules/Player/pick-start-tile';

const width = 20,
  height = 12,
  // A 10 × 4 continent of Grassland (40 tiles) in the top left, and three
  // one-tile islands well away from it.
  isLand = (x: number, y: number): boolean =>
    (x < 10 && y < 4) ||
    (x === 14 && y === 8) ||
    (x === 16 && y === 11) ||
    (x === 12 && y === 10),
  isContinent = (tile: Tile): boolean => tile.x() < 10 && tile.y() < 4,
  // Enough evenly spread values to land on every entry of a short list.
  randomValues = Array.from({ length: 200 }, (_, i) => i / 200),
  setUp = async (): Promise<{
    world: World;
    pick: (usedStartSquares: Tile[], random: number) => Tile | undefined;
  }> => {
    const ruleRegistry = new RuleRegistry(),
      world = await new World(
        new Loader(
          height,
          width,
          Array.from({ length: width * height }, (_, i): [Terrain] => [
            isLand(i % width, Math.floor(i / width))
              ? new Grassland()
              : new Ocean(),
          ]),
          new TerrainFeatureRegistry()
        ),
        ruleRegistry,
        new LandMassRegistry()
      ).build(),
      engine = new Engine(),
      player = new Player(ruleRegistry);

    return {
      world,
      pick: (usedStartSquares: Tile[], random: number): Tile | undefined => {
        const rules = new RuleRegistry();

        rules.register(...pickStartTile(undefined, engine, () => random));

        const [tile] = rules.process(
          PickStartTile,
          world,
          player,
          usedStartSquares
        );

        return tile;
      },
    };
  };

describe('player:pick-start-tile', (): void => {
  it('should never pick a tile within 4 of a used start square', async (): Promise<void> => {
    const { world, pick } = await setUp(),
      used = world.get(2, 1);

    randomValues.forEach((random) => {
      const tile = pick([used], random)!;

      expect(tile).to.be.instanceOf(Tile);
      expect(civ1Distance(used, tile)).to.be.greaterThan(4);
    });
  });

  it('should not start on a small island while a large landmass has room', async (): Promise<void> => {
    const { pick } = await setUp();

    randomValues.forEach((random) =>
      expect(isContinent(pick([], random)!)).to.equal(true)
    );
  });

  it('should fall back to a small island once the large landmass is full', async (): Promise<void> => {
    const { world, pick } = await setUp(),
      used = world.filter(isContinent);

    randomValues.forEach((random) => {
      const tile = pick(used, random);

      expect(tile).to.be.instanceOf(Tile);
      expect(isContinent(tile!)).to.equal(false);
    });
  });
});
