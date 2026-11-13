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
import Start from '@civ-clone/core-engine/Rules/Start';
import startWorld from '@civ-clone/base-world-start/lib/startWorld';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstances,
  generatorRegistry: GeneratorRegistry = generatorRegistryInstance,
  engine: Engine = engineInstance
): Start[] => [
  new Start(
    new Effect((): void => {
      startWorld(ruleRegistry, engine, {
        // The grid the world is laid out on, unless the `topologyId` option names one of core-world's `topologyIds`.
        defaults: {
          topologyId: 'square',
          height: 100,
          width: 160,
          landCoverage: 0.4,
          landSize: 0.2,
          maxIterations: 20,
        },
        check: (topologyId: string): void => {
          // Earth's maps are square data, one letter per square in rows, so they
          // cannot be laid out on another grid.
          if (engine.option('earth', false) && topologyId !== 'square') {
            throw new Error(
              `start: the 'earth' option is only available on the 'square' grid, but 'topologyId' is '${topologyId}'.`
            );
          }
        },
      });
    })
  ),
];

export default getRules;
