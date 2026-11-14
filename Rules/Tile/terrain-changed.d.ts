import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TerrainFeatureRegistry } from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
export declare const FOREST_TO_PLAINS =
  'civ1-world:terrain-changed/forest-to-plains';
export declare const TO_FOREST = 'civ1-world:terrain-changed/to-forest';
export declare const TO_GRASSLAND = 'civ1-world:terrain-changed/to-grassland';
export declare const CLEAR_YIELD_CACHE =
  'civ1-world:terrain-changed/clear-yield-cache';
/**
 * What a square's features become when a unit converts its terrain. As in
 * Civ1, a special resource stays with the square as the new terrain's own
 * special (civ-clone/web-renderer#281), a square without one stays without one,
 * and every feature of the old terrain is unregistered. Other terrain changes
 * leave the features where they are.
 *
 * A square's yields are worked out again after any terrain change.
 *
 * TODO: these treat every feature as a special. When rivers arrive as a
 *  `Watercourse` feature (civ-clone/web-renderer#1008, G15), exclude them here
 *  (`isResource` from base-terrain-feature) and carry them over instead.
 */
export declare const getRules: (
  terrainFeatureRegistry?: TerrainFeatureRegistry,
  ruleRegistry?: RuleRegistry,
  playerRegistry?: PlayerRegistry
) => TerrainChanged[];
export default getRules;
