import { Forest, Grassland, Jungle, Plains, Swamp } from '../../Terrains';
import { Game, Horse, Shield } from '../../TerrainFeatures';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Feature from '@civ-clone/core-terrain-feature/Rules/Feature';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import changesTerrain from '@civ-clone/base-terrain-feature/lib/changesTerrain';
import replaceFeatures from '@civ-clone/base-terrain-feature/lib/replaceFeatures';

export const FOREST_TO_PLAINS = 'civ1-world:terrain-changed/forest-to-plains';
export const TO_FOREST = 'civ1-world:terrain-changed/to-forest';
export const TO_GRASSLAND = 'civ1-world:terrain-changed/to-grassland';

/**
 * What a square's features become when a unit converts its terrain. A special
 * resource stays with the square as the new terrain's own special
 * (civ-clone/web-renderer#281), and every feature of the old terrain is
 * unregistered. Other terrain changes leave the features where they are.
 */
export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance
): TerrainChanged[] => [
  // Clearing a Forest: its Game becomes Horses on the Plains.
  new TerrainChanged(
    FOREST_TO_PLAINS,
    new Criterion(changesTerrain([Forest], [Plains])),
    new Effect(
      replaceFeatures(
        terrainFeatureRegistry,
        (features: TerrainFeature[], to: Terrain): TerrainFeature[] =>
          features.length > 0 ? [new Horse(to)] : []
      )
    )
  ),
  // Planting a Forest: Oil, Gems or Horses become Game. Grassland's Shield isn't a special resource, so it doesn't
  //  carry over.
  new TerrainChanged(
    TO_FOREST,
    new Criterion(changesTerrain([Plains, Grassland, Jungle, Swamp], [Forest])),
    new Effect(
      replaceFeatures(
        terrainFeatureRegistry,
        (features: TerrainFeature[], to: Terrain): TerrainFeature[] =>
          features.some(
            (feature: TerrainFeature): boolean => !(feature instanceof Shield)
          )
            ? [new Game(to)]
            : []
      )
    )
  ),
  // Clearing a Jungle or a Swamp: its special is lost, and the Grassland rolls for a Shield as a new square would.
  new TerrainChanged(
    TO_GRASSLAND,
    new Criterion(changesTerrain([Jungle, Swamp], [Grassland])),
    new Effect(
      replaceFeatures(
        terrainFeatureRegistry,
        (features: TerrainFeature[], to: Terrain): TerrainFeature[] => {
          ruleRegistry.process(Feature, Shield, to);

          return [];
        }
      )
    )
  ),
];

export default getRules;
