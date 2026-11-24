import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { LandMassRegistry } from '@civ-clone/core-world/LandMassRegistry';
import Start from '@civ-clone/core-engine/Rules/Start';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  engine?: Engine,
  landMassRegistry?: LandMassRegistry
) => Start[];
export default getRules;
