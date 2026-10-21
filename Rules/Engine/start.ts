import {
  GeneratorRegistry,
  instance as generatorRegistryInstance,
} from '@civ-clone/core-world-generator/GeneratorRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstances,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Effect from '@civ-clone/core-rule/Effect';
import PickGenerator from '@civ-clone/core-world-generator/Rules/PickGenerator';
import Start from '@civ-clone/core-engine/Rules/Start';
import World from '@civ-clone/core-world/World';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstances,
  generatorRegistry: GeneratorRegistry = generatorRegistryInstance,
  engine: Engine = engineInstance
): Start[] => [
  new Start(
    new Effect((): void => {
      // The grid the world is laid out on: one of core-world's `topologyIds`.
      const topologyId: string = engine.option('topologyId', 'square');

      // Earth's maps are square data, one letter per square in rows, so they
      // cannot be laid out on another grid.
      if (engine.option('earth', false) && topologyId !== 'square') {
        throw new Error(
          `start: the 'earth' option is only available on the 'square' grid, but 'topologyId' is '${topologyId}'.`
        );
      }

      const [Generator] = ruleRegistry.process(PickGenerator),
        generator = new Generator(
          parseInt(engine.option('height', 100), 10),
          parseInt(engine.option('width', 160), 10),
          {
            landCoverage: parseFloat(engine.option('landCoverage', 0.4)),
            landSize: parseFloat(engine.option('landSize', 0.2)),
            maxIterations: parseInt(engine.option('maxIterations', 20), 10),
            topologyId,
          }
        );

      // Check the grid against the size the generator really lays out (Earth
      // picks the nearest of its fixed maps) before anything is generated: an
      // unknown id, or an odd height on a grid that wraps north to south,
      // throws here rather than part way through building the world.
      generator.topology().validate(generator.width(), generator.height());

      const world: World = new World(generator, ruleRegistry);

      world.build();
    })
  ),
];

export default getRules;
