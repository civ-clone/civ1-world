import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
export declare const FOREST_TO_PLAINS =
  'civ1-world:terrain-changed/forest-to-plains';
export declare const TO_FOREST = 'civ1-world:terrain-changed/to-forest';
export declare const TO_GRASSLAND = 'civ1-world:terrain-changed/to-grassland';
/**
 * What a square's features become when a unit converts its terrain. A special
 * resource stays with the square as the new terrain's own special
 * (civ-clone/web-renderer#281), and every feature of the old terrain is
 * unregistered. Other terrain changes leave the features where they are.
 */
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => TerrainChanged[];
export default getRules;
