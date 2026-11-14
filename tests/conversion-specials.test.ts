// The terrain features, made available as the game makes them (the `new Plains()` a conversion builds rolls for them),
//  and the rules, registered on the game the singletons belong to. Both are imported for their side effects.
import '../registerTerrainFeatures';
import '../registerRules';
import { Forest, Grassland, Jungle, Plains, Swamp } from '../Terrains';
import { Game, Gems, Horse, Oil, Shield } from '../TerrainFeatures';
import ClearForest from '@civ-clone/base-unit-action-clear-forest/ClearForest';
import ClearJungle from '@civ-clone/base-unit-action-clear-jungle/ClearJungle';
import ClearSwamp from '@civ-clone/base-unit-action-clear-swamp/ClearSwamp';
import PlantForest from '@civ-clone/base-unit-action-plant-forest/PlantForest';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import { defaultGame } from '@civ-clone/civ1-game';
import { expect } from 'chai';
import { instance as rng } from '@civ-clone/core-random';

// Every other test file shares these singletons, and a `new Terrain()` anywhere rolls for whatever is available. So
//  the features are only available while these tests run.
const available = defaultGame.availableTerrainFeatures.entries();

defaultGame.availableTerrainFeatures.unregister(...available);

type Conversion =
  | typeof ClearForest
  | typeof ClearJungle
  | typeof ClearSwamp
  | typeof PlantForest;

const SEEDS = 2000;

/**
 * Converts a square of `From` holding `features`, once per seed, as the game does: on the game's own registries, so
 * the new terrain the action builds rolls its features as it would in a game. Returns, per seed, the features left on
 * the square's new terrain and how many were left on its old one.
 */
const convert = (
  Action: Conversion,
  From: typeof Terrain,
  features: (typeof TerrainFeature)[]
): { onSquare: TerrainFeature[]; leftBehind: number }[] =>
  Array.from({ length: SEEDS }, (_, i) => {
    const tile = new Tile(
      0,
      0,
      new From(),
      null as unknown as World,
      defaultGame.rules
    );

    // Whatever the old terrain rolled when it was made is replaced by the features this case wants.
    defaultGame.terrainFeatures.unregister(
      ...defaultGame.terrainFeatures.getByTerrain(tile.terrain())
    );
    features.forEach((FeatureType) =>
      defaultGame.terrainFeatures.register(new FeatureType(tile.terrain()))
    );

    const from = tile.terrain();

    rng.restore(i + 1, 0);

    Action.complete(
      new Action(
        tile,
        tile,
        null as never,
        defaultGame.rules,
        defaultGame.terrainFeatures
      ) as never
    );

    const onSquare = defaultGame.terrainFeatures.getByTerrain(tile.terrain()),
      leftBehind = defaultGame.terrainFeatures.getByTerrain(from);

    defaultGame.terrainFeatures.unregister(...onSquare, ...leftBehind);

    return { onSquare, leftBehind: leftBehind.length };
  });

const names = (features: TerrainFeature[]): string =>
  features.map((feature) => feature.constructor.name).join(', ');

// How many conversions left the square with anything but `expected` (by name, in any order).
const mismatches = (
  results: { onSquare: TerrainFeature[] }[],
  expected: string
): number =>
  results.filter(({ onSquare }) => names(onSquare) !== expected).length;

describe('terrain conversions, on the game registries, over many seeds (civ-clone/web-renderer#1038)', (): void => {
  before((): void =>
    defaultGame.availableTerrainFeatures.register(...available)
  );
  after((): void =>
    defaultGame.availableTerrainFeatures.unregister(...available)
  );

  it('rolls features for a newly made terrain, so these tests can see a conversion roll them', (): void => {
    const shields = Array.from({ length: SEEDS }, (_, i) => {
      rng.restore(i + 1, 0);

      const terrain = new Grassland(defaultGame.rules),
        features = defaultGame.terrainFeatures.getByTerrain(terrain);

      defaultGame.terrainFeatures.unregister(...features);

      return features.length;
    }).reduce((total, count) => total + count, 0);

    expect(shields / SEEDS).to.be.within(0.45, 0.55);
  });

  (
    [
      [ClearForest, Forest, [], ''],
      [ClearForest, Forest, [Game], 'Horse'],
      [PlantForest, Plains, [], ''],
      [PlantForest, Plains, [Horse], 'Game'],
      [PlantForest, Grassland, [], ''],
      [PlantForest, Grassland, [Shield], ''],
      [PlantForest, Jungle, [Gems], 'Game'],
      [PlantForest, Swamp, [Oil], 'Game'],
    ] as [Conversion, typeof Terrain, (typeof TerrainFeature)[], string][]
  ).forEach(([Action, From, features, expected]): void =>
    it(`${Action.name} on ${From.name} [${features
      .map((feature) => feature.name)
      .join(
        ', '
      )}] always leaves [${expected}] and nothing behind`, (): void => {
      const results = convert(Action, From, features);

      expect(mismatches(results, expected)).to.equal(0);
      expect(
        results.filter(({ leftBehind }) => leftBehind > 0).length
      ).to.equal(0);
    })
  );

  // Grassland's Shield is rolled once, at even odds, whatever the Jungle or Swamp held. With 2000 seeds the standard
  //  deviation of the rate is about 1.1%, so 45%-55% is over four of them either side of 50%, and still far from what
  //  rolling twice (75%) or never (0%) gives.
  (
    [
      [ClearJungle, Jungle, []],
      [ClearJungle, Jungle, [Gems]],
      [ClearJungle, Jungle, [Shield]],
      [ClearSwamp, Swamp, []],
      [ClearSwamp, Swamp, [Oil]],
      [ClearSwamp, Swamp, [Shield]],
    ] as [Conversion, typeof Terrain, (typeof TerrainFeature)[]][]
  ).forEach(([Action, From, features]): void =>
    it(`${Action.name} on ${From.name} [${features
      .map((feature) => feature.name)
      .join(
        ', '
      )}] leaves Grassland with one Shield half the time, and nothing else`, (): void => {
      const results = convert(Action, From, features),
        shields = results.filter(
          ({ onSquare }) => names(onSquare) === 'Shield'
        ).length;

      expect(
        results.length -
          shields -
          results.filter(({ onSquare }) => onSquare.length === 0).length
      ).to.equal(0);
      expect(shields / SEEDS).to.be.within(0.45, 0.55);
      expect(
        results.filter(({ leftBehind }) => leftBehind > 0).length
      ).to.equal(0);
    })
  );
});

// Nothing else works a square's yields out again when its terrain changes: `Tile.setTerrain` doesn't, and nothing
//  clears the cache at the start of a turn.
describe('terrain conversions and the yield cache (civ-clone/web-renderer#1038)', (): void => {
  const yields = (tile: Tile): string =>
    tile
      .yields(null)
      .map((tileYield) => `${tileYield.constructor.name} ${tileYield.value()}`)
      .join(', ');

  it('works out a converted square’s yields from its new terrain', (): void => {
    const tile = new Tile(
        0,
        0,
        new Forest(defaultGame.rules),
        null as unknown as World,
        defaultGame.rules
      ),
      plains = new Tile(
        1,
        0,
        new Plains(defaultGame.rules),
        null as unknown as World,
        defaultGame.rules
      );

    [tile, plains].forEach((tile) =>
      defaultGame.terrainFeatures.unregister(
        ...defaultGame.terrainFeatures.getByTerrain(tile.terrain())
      )
    );

    const before = yields(tile);

    ClearForest.complete(
      new ClearForest(
        tile,
        tile,
        null as never,
        defaultGame.rules,
        defaultGame.terrainFeatures
      ) as never
    );

    defaultGame.terrainFeatures.unregister(
      ...defaultGame.terrainFeatures.getByTerrain(tile.terrain())
    );

    expect(yields(plains)).to.not.equal(before);
    expect(yields(tile)).to.equal(yields(plains));
  });
});
