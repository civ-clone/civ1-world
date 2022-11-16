import { GeneratorRegistry } from '@civ-clone/core-world-generator/GeneratorRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import Start from '@civ-clone/core-engine/Rules/Start';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  generatorRegistry?: GeneratorRegistry,
  engine?: Engine
) => Start[];
export default getRules;
