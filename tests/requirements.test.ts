import {
  BridgeBuilding,
  Railroad as RailroadAdvance,
} from '@civ-clone/library-science/Advances';
import { Irrigation, Mine, Railroad, Road } from '../TileImprovements';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import {
  Condition,
  Requirement,
} from '@civ-clone/core-requirement/Requirement';
import Rule from '@civ-clone/core-rule/Rule';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import availableRequirements from '../Requirements';
import { expect } from 'chai';
import { generateFixedWorld } from './yield.test';
import getRules from '../Rules/TileImprovement/available';
import register from '../registerRules';

// Through `register(game)`, as a game gets them: the entries in `game.requirements`, and the rules made from them in
//  `game.rules` under the same ids (civ-clone/web-renderer#37). The fixed world's first row has one tile of each
//  terrain, every other column: Desert at 2, Grassland at 6, Mountains at 12, River at 18.
const setUp = async () => {
  const game = new Game();

  register(game);

  const world = await generateFixedWorld(game.terrainFeatures, game.rules),
    player = new Player(game.rules),
    research = new PlayerResearch(player, game.advances, game.rules);

  game.playerResearch.register(research);

  const canBuild = (Improvement: typeof TileImprovement, tile: Tile): boolean =>
    game.rules
      .get(Available)
      .some((rule: Available): boolean =>
        rule.validate(tile, Improvement, player)
      );

  return { canBuild, game, research, world };
};

const ids = (rules: Rule[]): (string | null)[] =>
  rules.map((rule: Rule): string | null => rule.id());

describe('civ1-world requirements', (): void => {
  it('should make one rule for each entry, under its id, in the order they always were', async (): Promise<void> => {
    const { game } = await setUp();

    availableRequirements.forEach((entry: Requirement): void => {
      const rules = game.requirements.rulesFor(entry.id);

      expect(rules, entry.id).length(1);
      expect(game.rules.getById(entry.id), entry.id).equal(rules[0]);
    });

    // Written out as `Rules/TileImprovement/available` had them, so a reordered table fails here.
    expect(ids(getRules())).eql([
      'civ1-world:tile-improvement/available/Irrigation',
      'civ1-world:tile-improvement/available/Mine',
      'civ1-world:tile-improvement/available/Road',
      'civ1-world:tile-improvement/available/bridge/Road',
      'civ1-world:tile-improvement/available/Railroad',
    ]);
    expect(ids(game.rules.get(Available))).eql(ids(getRules()));
  });

  it('should read the graph both ways', async (): Promise<void> => {
    const { game } = await setUp();

    expect(
      game.requirements.for(Road).map((entry: Requirement) => entry.id)
    ).eql([
      'civ1-world:tile-improvement/available/Road',
      'civ1-world:tile-improvement/available/bridge/Road',
    ]);
    expect(
      game.requirements
        .leadsTo(BridgeBuilding)
        .map((entry: Requirement) => entry.id)
    ).eql(['civ1-world:tile-improvement/available/bridge/Road']);
    expect(
      game.requirements.leadsTo(Road).map((entry: Requirement) => entry.id)
    ).eql(['civ1-world:tile-improvement/available/Railroad']);
  });

  it('should be buildable where the entries say, by any one of them', async (): Promise<void> => {
    const { canBuild, game, research, world } = await setUp(),
      grassland = world.get(6, 0),
      river = world.get(18, 0);

    expect(canBuild(Irrigation, grassland)).true;
    expect(canBuild(Mine, grassland)).false;
    expect(canBuild(Road, river)).false;
    expect(canBuild(Railroad, grassland)).false;

    research.addAdvance(BridgeBuilding);

    expect(canBuild(Road, river)).true;

    research.addAdvance(RailroadAdvance);

    expect(canBuild(Railroad, grassland)).false;

    game.tileImprovements.register(new Road(grassland));

    // Not a second Road where there's one already, but now a Railroad.
    expect(canBuild(Road, grassland)).false;
    expect(canBuild(Railroad, grassland)).true;
  });

  it('should refuse an entry it cannot play, and let one with no terrains go anywhere', async (): Promise<void> => {
    const { canBuild, game, world } = await setUp(),
      [mine] = availableRequirements.filter(
        (entry: Requirement): boolean => entry.subject === Mine
      ),
      replaceMine = (changes: object): void =>
        game.requirements.replace(
          mine.id,
          new Requirement({
            id: mine.id,
            subject: Mine,
            relation: 'requires',
            targets: [],
            range: 'tile',
            where: mine.where as any,
            ...changes,
          })
        );

    expect(() =>
      replaceMine({ targets: [Road, Irrigation], mode: 'any' })
    ).to.throw(TypeError, /mode must be 'all'/);
    expect(() =>
      replaceMine({ targets: [new Condition('test:somewhere')] })
    ).to.throw(TypeError, /not test:somewhere/);
    expect(game.requirements.getById(mine.id)).equal(mine);

    replaceMine({ where: undefined });

    expect(canBuild(Mine, world.get(6, 0))).true;
  });

  it('should change where an improvement can go when a plugin changes an entry', async (): Promise<void> => {
    const { canBuild, game, world } = await setUp(),
      grassland = world.get(6, 0),
      [mine] = availableRequirements.filter(
        (entry: Requirement): boolean => entry.subject === Mine
      );

    game.requirements.replace(
      mine.id,
      new Requirement({
        id: mine.id,
        subject: Mine,
        relation: 'requires',
        targets: [],
        range: 'tile',
        where: [...mine.where!, grassland.terrain().constructor as any],
      })
    );

    expect(canBuild(Mine, grassland)).true;
  });
});
