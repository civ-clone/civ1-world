import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  GeneratorRegistry,
  instance as generatorRegistryInstance,
} from '@civ-clone/core-world-generator/GeneratorRegistry';
import Earth from '@civ-clone/civ1-earth-generator/Earth';
import Effect from '@civ-clone/core-rule/Effect';
import PickGenerator from '@civ-clone/core-world-generator/Rules/PickGenerator';
import pickGenerator from '@civ-clone/base-world-start/lib/pickGenerator';
import { instance as rngInstance } from '@civ-clone/core-random';

export const getRules: (
  generatorRegistry?: GeneratorRegistry,
  engine?: Engine,
  randomNumberGenerator?: () => number
) => PickGenerator[] = (
  generatorRegistry: GeneratorRegistry = generatorRegistryInstance,
  engine: Engine = engineInstance,
  randomNumberGenerator: () => number = rngInstance
): PickGenerator[] => [
  new PickGenerator(
    new Effect(() => {
      if (engine.option('earth', false)) {
        return Earth;
      }

      return pickGenerator(generatorRegistry, randomNumberGenerator);
    })
  ),
];

export default getRules;
