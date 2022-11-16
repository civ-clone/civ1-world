import { Engine } from '@civ-clone/core-engine/Engine';
import { GeneratorRegistry } from '@civ-clone/core-world-generator/GeneratorRegistry';
import PickGenerator from '@civ-clone/core-world-generator/Rules/PickGenerator';
export declare const getRules: (
  generatorRegistry?: GeneratorRegistry,
  engine?: Engine,
  randomNumberGenerator?: () => number
) => PickGenerator[];
export default getRules;
