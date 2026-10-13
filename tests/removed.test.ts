import { Grassland } from '../Terrains';
import Engine from '@civ-clone/core-engine/Engine';
import FillGenerator from '@civ-clone/simple-world-generator/tests/lib/FillGenerator';
import { Food } from '../Yields';
import { Pollution } from '../TileImprovements';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import removed from '../Rules/TileImprovement/removed';
import tileYield from '../Rules/Tile/yield';
import tileYieldModifier from '../Rules/Tile/yield-modifier';

describe('tile-improvement/removed', (): void => {
  it('takes the improvement off the tile, refreshes its yields and tells the client', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      engine = new Engine(),
      world = new World(new FillGenerator(1, 1, Grassland), ruleRegistry),
      events: unknown[][] = [];

    ruleRegistry.register(
      ...tileYield(tileImprovementRegistry),
      ...tileYieldModifier(tileImprovementRegistry),
      ...removed(tileImprovementRegistry, engine)
    );

    await world.build();

    const tile = world.get(0, 0),
      pollution = new Pollution(tile, ruleRegistry),
      food = (): number =>
        tile
          .yields()
          .filter((tileYield) => tileYield instanceof Food)
          .reduce((total, tileYield) => total + tileYield.value(), 0);

    tileImprovementRegistry.register(pollution);

    expect(food()).to.equal(1);

    engine.on('tile-improvement:removed', (...args: unknown[]) =>
      events.push(args)
    );

    ruleRegistry.process(Removed, tile, pollution);

    expect(tileImprovementRegistry.getByTile(tile)).to.deep.equal([]);
    expect(food()).to.equal(2);
    expect(events.length).to.equal(1);
    expect(events[0][0] === tile && events[0][1] === pollution).to.true;
  });
});
