import { Built, IBuiltRegistry } from '@civ-clone/core-world/Rules/Built';
import {
  GeneratorRegistry,
  instance as generatorRegistryInstance,
} from '@civ-clone/core-world-generator/GeneratorRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstances,
} from '@civ-clone/core-rule/RuleRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Generator from '@civ-clone/core-world-generator/Generator';
import Start from '@civ-clone/core-engine/Rules/Start';
import World from '@civ-clone/core-world/World';
import { instance as engine } from '@civ-clone/core-engine/Engine';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstances,
  generatorRegistry: GeneratorRegistry = generatorRegistryInstance
): Start[] => [
  new Start(
    new Effect((): void => {
      // TODO: Registry.getRandom()
      const availableGenerators: typeof Generator[] = generatorRegistry.entries(),
        RandomGenerator: typeof Generator =
          availableGenerators[
            Math.floor(availableGenerators.length * Math.random())
          ],
        generator: Generator = new RandomGenerator(
          parseInt(engine.option('height', 100), 10),
          parseInt(engine.option('width', 160), 10),
          {
            landCoverage: parseFloat(
              engine.option('landCoverage', 0.2 + Math.random() * 0.2)
            ),
            landMassReductionScale: parseFloat(
              engine.option('landMassReductionScale', Math.random() * 5)
            ),
            // chanceToBecomeLand: parseInt(engine.option('chanceToBecomeLand', Math.random() / 15), 10),
            // smoothness
            maxIterations: parseInt(engine.option('maxIterations', 5), 10),
          }
        ),
        world: World = new World(generator);

      world.build();

      (ruleRegistry as IBuiltRegistry).process(Built, world);
    })
  ),
];

export default getRules;
