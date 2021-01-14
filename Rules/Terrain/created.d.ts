import { AvailableTerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Created from '@civ-clone/core-terrain/Rules/Created';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  availableTerrainFeatureRegistry?: AvailableTerrainFeatureRegistry
) => Created[];
export default getRules;
