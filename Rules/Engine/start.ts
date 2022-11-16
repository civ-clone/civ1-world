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
      const [Generator] = ruleRegistry.process(PickGenerator),
        generator = new Generator(
          parseInt(engine.option('height', 100), 10),
          parseInt(engine.option('width', 160), 10),
          {
            landCoverage: parseFloat(engine.option('landCoverage', 0.4)),
            landSize: parseFloat(engine.option('landSize', 0.2)),
            maxIterations: parseInt(engine.option('maxIterations', 20), 10),
          }
        ),
        world: World = new World(generator, ruleRegistry);

      world.build();
    })
  ),
];

export default getRules;
