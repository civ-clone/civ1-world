import { Forest, Grassland, Jungle, Plains, Swamp } from '../../Terrains';
import { Game, Horse, Shield } from '../../TerrainFeatures';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import replaceFeatures, {
  FeatureReplacer,
} from '@civ-clone/base-terrain-feature/lib/replaceFeatures';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import {
  Feature,
  feature,
} from '@civ-clone/core-terrain-feature/Rules/Feature';
import { SHIELD_CHANCE } from '../Terrain/feature';
import Player from '@civ-clone/core-player/Player';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainChanged from '@civ-clone/core-world/Rules/TerrainChanged';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';
import Tile from '@civ-clone/core-world/Tile';
import changesTerrain from '@civ-clone/base-terrain-feature/lib/changesTerrain';

export const FOREST_TO_PLAINS = 'civ1-world:terrain-changed/forest-to-plains';
export const TO_FOREST = 'civ1-world:terrain-changed/to-forest';
export const TO_GRASSLAND = 'civ1-world:terrain-changed/to-grassland';
export const CLEAR_YIELD_CACHE = 'civ1-world:terrain-changed/clear-yield-cache';

/**
 * A `TerrainChanged` effect for a unit converting a square's terrain: the new
 * terrain is made before it is set, and made terrain rolls for its own
 * features (the `Created` rule), so whatever it rolled is taken off it first.
 * Then `replace` decides the square's features from the old terrain's, which
 * are all unregistered (civ-clone/web-renderer#1038).
 *
 * Taking off everything on the new terrain relies on it having just been made
 * for this change, so all it holds is what it rolled. A feature that belongs
 * to the square rather than the terrain (a river, once it is a `Watercourse`
 * feature, G15) must be carried over by `replace`, not stripped here.
 */
const convertFeatures = (
  terrainFeatureRegistry: TerrainFeatureRegistry,
  replace: FeatureReplacer
): ((tile: Tile, from: Terrain, to: Terrain) => void) =>
  replaceFeatures(
    terrainFeatureRegistry,
    (
      features: TerrainFeature[],
      to: Terrain,
      from: Terrain,
      tile: Tile
    ): TerrainFeature[] => {
      const rolled = terrainFeatureRegistry.getByTerrain(to);

      if (rolled.length > 0) {
        terrainFeatureRegistry.unregister(...rolled);
      }

      return replace(features, to, from, tile);
    }
  );

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
export const getRules = (
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance
): TerrainChanged[] => {
  // The Grassland's Shield roll, built on the registry these rules move features in, so it can never land in another
  //  one, at the odds a Grassland is made with.
  const shieldRules: Feature[] = feature(
    Grassland,
    Shield,
    SHIELD_CHANCE,
    terrainFeatureRegistry
  );

  return [
    // Clearing a Forest: its Game becomes Horses on the Plains.
    new TerrainChanged(
      FOREST_TO_PLAINS,
      new Criterion(changesTerrain([Forest], [Plains])),
      new Effect(
        convertFeatures(
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
      new Criterion(
        changesTerrain([Plains, Grassland, Jungle, Swamp], [Forest])
      ),
      new Effect(
        convertFeatures(
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
    // Clearing a Jungle or a Swamp: its special is lost, and the Grassland rolls for a Shield, here and only here. Any
    //  Shield it was given before (when it was made, or by the conversion itself) has been taken off it, so the odds
    //  are the Shield rule's own whatever made the conversion.
    new TerrainChanged(
      TO_GRASSLAND,
      new Criterion(changesTerrain([Jungle, Swamp], [Grassland])),
      new Effect(
        convertFeatures(
          terrainFeatureRegistry,
          (features: TerrainFeature[], to: Terrain): TerrainFeature[] => {
            shieldRules
              .filter((rule: Feature): boolean => rule.validate(Shield, to))
              .forEach((rule: Feature): void => rule.process(Shield, to));

            return [];
          }
        )
      )
    ),
    // Nothing else works a square's yields out again when its terrain changes (`Tile.setTerrain` doesn't, and nothing
    //  clears the cache at the start of a turn), so the old terrain's yields would stay, for nobody and for each player.
    new TerrainChanged(
      CLEAR_YIELD_CACHE,
      new Effect((tile: Tile): void => {
        tile.clearYieldCache(null);

        playerRegistry.forEach((player: Player): void =>
          tile.clearYieldCache(player)
        );
      })
    ),
  ];
};

export default getRules;
