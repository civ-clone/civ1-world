import { Coal, Fish, Game, Gems, Horse, Oil, Shield } from '../TerrainFeatures';
import {
  Forest,
  Grassland,
  Hills,
  Jungle,
  Ocean,
  Plains,
  Swamp,
} from '../Terrains';
import ClearForest from '@civ-clone/base-unit-action-clear-forest/ClearForest';
import ClearJungle from '@civ-clone/base-unit-action-clear-jungle/ClearJungle';
import ClearSwamp from '@civ-clone/base-unit-action-clear-swamp/ClearSwamp';
import { Game as Civ1Game } from '@civ-clone/civ1-game';
import PlantForest from '@civ-clone/base-unit-action-plant-forest/PlantForest';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import { instance as rng } from '@civ-clone/core-random';
import { register } from '../registerRules';

// What finishing each terrain conversion leaves on the square, with the whole
//  civ1 ruleset registered: the terrain, every feature in the registry in
//  order, and how many random numbers it drew. Civ1 keeps a square's special
//  when the terrain changes, as the new terrain's own special (civ-clone/web-renderer#281).
type Conversion =
  | typeof ClearForest
  | typeof ClearJungle
  | typeof ClearSwamp
  | typeof PlantForest;

// A seed whose second draw keeps Grassland's Shield (<= 0.5) and one whose
//  second draw doesn't. Clearing a Jungle or a Swamp draws twice: the
//  conversion rolls for a Shield, and the Grassland's rule takes that one off
//  and rolls again, which is the roll that counts (civ-clone/web-renderer#1038).
//  If the shared base-unit-action-clear-jungle/-clear-swamp conversions stop
//  rolling for a Shield themselves, the deciding roll becomes the first draw
//  and this must change back.
const shieldSeed = (wanted: boolean): number => {
  for (let seed = 1; ; seed++) {
    rng.restore(seed, 0);
    rng();

    if (rng() <= 0.5 === wanted) {
      return seed;
    }
  }
};

const convert = (
  Action: Conversion,
  TerrainType: typeof Terrain,
  features: (typeof TerrainFeature)[],
  seed: number = 1
): [string, string[], number] => {
  const game = new Civ1Game();

  register(game);

  const tile = new Tile(
      0,
      0,
      new TerrainType(),
      null as unknown as World,
      game.rules
    ),
    before = new Coal(new Hills()),
    after = new Fish(new Ocean());

  game.terrainFeatures.register(before);
  features.forEach((FeatureType) =>
    game.terrainFeatures.register(new FeatureType(tile.terrain()))
  );
  game.terrainFeatures.register(after);

  rng.restore(seed, 0);

  Action.complete(
    new Action(
      tile,
      tile,
      null as never,
      game.rules,
      game.terrainFeatures
    ) as never
  );

  const draws = rng.calls();

  return [
    tile.terrain().constructor.name,
    game.terrainFeatures
      .entries()
      .map(
        (feature: TerrainFeature) =>
          feature.constructor.name +
          (feature === before
            ? ' (before)'
            : feature === after
            ? ' (after)'
            : feature.terrain() === tile.terrain()
            ? ' (square)'
            : ' (stale)')
      ),
    draws,
  ];
};

// What finishing each conversion leaves on the square, and how many random numbers it drew.
describe('terrain conversions', (): void => {
  describe('ClearForest', (): void => {
    it('turns Forest into Plains, with no special', (): void => {
      expect(convert(ClearForest, Forest, [])).to.deep.equal([
        'Plains',
        ['Coal (before)', 'Fish (after)'],
        0,
      ]);
    });

    it('turns Forest with Game into Plains with Horses', (): void => {
      expect(convert(ClearForest, Forest, [Game])).to.deep.equal([
        'Plains',
        ['Coal (before)', 'Fish (after)', 'Horse (square)'],
        0,
      ]);
    });

    it('turns any features into one Horses', (): void => {
      expect(convert(ClearForest, Forest, [Game, Shield])).to.deep.equal([
        'Plains',
        ['Coal (before)', 'Fish (after)', 'Horse (square)'],
        0,
      ]);
      expect(convert(ClearForest, Forest, [Shield])).to.deep.equal([
        'Plains',
        ['Coal (before)', 'Fish (after)', 'Horse (square)'],
        0,
      ]);
    });
  });

  (
    [
      [ClearJungle, Jungle, Gems],
      [ClearSwamp, Swamp, Oil],
    ] as [Conversion, typeof Terrain, typeof TerrainFeature][]
  ).forEach(([Action, TerrainType, Special]): void => {
    describe(Action.name, (): void => {
      [[], [Special], [Special, Shield], [Shield]].forEach((features) => {
        const label = features.map((feature) => feature.name).join(', ');

        it(`turns ${TerrainType.name} [${label}] into Grassland, dropping its features and rolling for a Shield`, (): void => {
          expect(
            convert(Action, TerrainType, features, shieldSeed(true))
          ).to.deep.equal([
            'Grassland',
            ['Coal (before)', 'Fish (after)', 'Shield (square)'],
            2,
          ]);
          expect(
            convert(Action, TerrainType, features, shieldSeed(false))
          ).to.deep.equal(['Grassland', ['Coal (before)', 'Fish (after)'], 2]);
        });
      });
    });
  });

  describe('PlantForest', (): void => {
    (
      [
        [Plains, Horse],
        [Grassland, null],
        [Jungle, Gems],
        [Swamp, Oil],
      ] as [typeof Terrain, typeof TerrainFeature | null][]
    ).forEach(([TerrainType, Special]): void => {
      it(`turns ${TerrainType.name} into Forest, with no special`, (): void => {
        expect(convert(PlantForest, TerrainType, [])).to.deep.equal([
          'Forest',
          ['Coal (before)', 'Fish (after)'],
          0,
        ]);
      });

      it(`turns ${TerrainType.name} with a Shield into Forest, with no special`, (): void => {
        expect(convert(PlantForest, TerrainType, [Shield])).to.deep.equal([
          'Forest',
          ['Coal (before)', 'Fish (after)'],
          0,
        ]);
      });

      if (Special !== null) {
        it(`turns ${TerrainType.name} with ${Special.name} into Forest with Game`, (): void => {
          expect(convert(PlantForest, TerrainType, [Special])).to.deep.equal([
            'Forest',
            ['Coal (before)', 'Fish (after)', 'Game (square)'],
            0,
          ]);
          expect(
            convert(PlantForest, TerrainType, [Special, Shield])
          ).to.deep.equal([
            'Forest',
            ['Coal (before)', 'Fish (after)', 'Game (square)'],
            0,
          ]);
          expect(
            convert(PlantForest, TerrainType, [Shield, Special])
          ).to.deep.equal([
            'Forest',
            ['Coal (before)', 'Fish (after)', 'Game (square)'],
            0,
          ]);
        });
      }
    });
  });
});
