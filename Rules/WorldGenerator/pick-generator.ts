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

export const getRules: (
  generatorRegistry?: GeneratorRegistry,
  engine?: Engine,
  randomNumberGenerator?: () => number
) => PickGenerator[] = (
  generatorRegistry: GeneratorRegistry = generatorRegistryInstance,
  engine: Engine = engineInstance,
  randomNumberGenerator: () => number = () => Math.random()
): PickGenerator[] => [
  new PickGenerator(
    new Effect(() => {
      if (engine.option('earth', false)) {
        return Earth;
      }

      const availableGenerators = generatorRegistry.entries();

      if (availableGenerators.length === 0) {
        throw new TypeError('No available `World` generators.');
      }

      return availableGenerators[
        Math.floor(availableGenerators.length * randomNumberGenerator())
      ];
    })
  ),
];

export default getRules;
