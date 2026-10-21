import Built from '@civ-clone/core-world/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Generator from '@civ-clone/core-world-generator/Generator';
import GeneratorRegistry from '@civ-clone/core-world-generator/GeneratorRegistry';
import HexOddRTopology from '@civ-clone/core-world/HexOddRTopology';
import { Ocean } from '../Terrains';
import PickGenerator from '@civ-clone/core-world-generator/Rules/PickGenerator';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import SquareTopology from '@civ-clone/core-world/SquareTopology';
import Start from '@civ-clone/core-engine/Rules/Start';
import Terrain from '@civ-clone/core-terrain/Terrain';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import pickGenerator from '../Rules/WorldGenerator/pick-generator';
import start from '../Rules/Engine/start';

// Every generator the start rule built, and how many times one generated.
let generators: Generator[] = [],
  generated = 0;

// An all-Ocean world, so that building it needs no rules of its own.
class OceanGenerator extends Generator {
  constructor(
    height: number,
    width: number,
    options: { [key: string]: any } = {}
  ) {
    super(height, width, options);

    generators.push(this);
  }

  async generate(): Promise<Terrain[]> {
    generated++;

    return Array.from(
      { length: this.height() * this.width() },
      (): Terrain => new Ocean()
    );
  }
}

const setUp = (
  options: { [key: string]: any },
  pick: 'ocean' | 'civ1' = 'ocean'
): {
  built: Promise<World>;
  picked: () => number;
  run: () => void;
} => {
  const ruleRegistry = new RuleRegistry(),
    engine = new Engine();
  let picked = 0,
    resolveBuilt: (world: World) => void = () => {};

  Object.entries(options).forEach(([key, value]) =>
    engine.setOption(key, value)
  );

  ruleRegistry.register(
    ...start(ruleRegistry, new GeneratorRegistry(), engine),
    new Built(new Effect((world: World): void => resolveBuilt(world)))
  );

  if (pick === 'ocean') {
    ruleRegistry.register(
      new PickGenerator(
        new Effect(() => {
          picked++;

          return OceanGenerator;
        })
      )
    );
  }

  if (pick === 'civ1') {
    ruleRegistry.register(...pickGenerator(new GeneratorRegistry(), engine));
  }

  return {
    built: new Promise<World>((resolve) => (resolveBuilt = resolve)),
    picked: () => picked,
    run: () => ruleRegistry.process(Start),
  };
};

describe('engine:start', (): void => {
  beforeEach((): void => {
    generators = [];
    generated = 0;
  });

  it('should build a square world when no topologyId is given', async (): Promise<void> => {
    const { built, run } = setUp({ height: 6, width: 8 });

    run();

    const world = await built,
      [generator] = generators;

    expect(generators).to.have.length(1);
    expect(generator.options()).to.deep.equal({
      landCoverage: 0.4,
      landSize: 0.2,
      maxIterations: 20,
      topologyId: 'square',
    });
    expect(generator.topology()).to.be.instanceOf(SquareTopology);
    expect(world.topologyId()).to.equal('square');
    expect(world.topology().id()).to.equal('square');
    expect(world.width()).to.equal(8);
    expect(world.height()).to.equal(6);
    expect(world.entries()).to.have.length(48);
    expect(generated).to.equal(1);
  });

  it('should build a world on the grid the topologyId option names', async (): Promise<void> => {
    const { built, run } = setUp({
      height: 6,
      width: 8,
      topologyId: 'hex-odd-r',
    });

    run();

    const world = await built,
      [generator] = generators;

    expect(generator.options().topologyId).to.equal('hex-odd-r');
    expect(generator.topology()).to.be.instanceOf(HexOddRTopology);
    expect(world.topologyId()).to.equal('hex-odd-r');
    expect(world.topology().id()).to.equal('hex-odd-r');
    expect(world.topology().wrapsY()).to.be.true;
    expect(world.entries()).to.have.length(48);
    expect(generated).to.equal(1);
  });

  it('should refuse a size the grid cannot make before generating anything', (): void => {
    const { run } = setUp({ height: 7, width: 8, topologyId: 'hex-odd-r' });

    expect(run).to.throw(
      Error,
      'HexOddRTopology: cannot make a 8x7 world that wraps vertically: the height must be even.'
    );
    expect(generators).to.have.length(1);
    expect(generated).to.equal(0);
  });

  it('should refuse a topologyId it does not know before generating anything', (): void => {
    const { run } = setUp({ height: 6, width: 8, topologyId: 'triangle' });

    expect(run).to.throw(Error, "createTopology: unknown topology 'triangle'");
    expect(generated).to.equal(0);
  });

  it('should refuse the earth option on any grid but square', (): void => {
    const { picked, run } = setUp({
      earth: true,
      height: 50,
      width: 80,
      topologyId: 'hex-odd-r',
    });

    expect(run).to.throw(
      Error,
      "start: the 'earth' option is only available on the 'square' grid, but 'topologyId' is 'hex-odd-r'."
    );
    expect(picked()).to.equal(0);
    expect(generators).to.have.length(0);
    expect(generated).to.equal(0);
  });

  it('should refuse the earth option on a non-square grid with the civ1 generator picker too', (): void => {
    const { run } = setUp(
      { earth: true, height: 50, width: 80, topologyId: 'staggered-iso' },
      'civ1'
    );

    expect(run).to.throw(Error, /'earth'.*'staggered-iso'/);
  });

  it('should build Earth on the square grid at the size of the map it picks', async (): Promise<void> => {
    // 80 x 49 has no map of its own, so Earth falls back to 80 x 50.
    const { built, run } = setUp(
      { earth: true, height: 49, width: 80, topologyId: 'square' },
      'civ1'
    );

    run();

    const world = await built;

    expect(generators).to.have.length(0);
    expect(world.entries().some((tile) => tile.isLand())).to.be.true;
    expect(world.topologyId()).to.equal('square');
    expect(world.width()).to.equal(80);
    expect(world.height()).to.equal(50);
  });
});
