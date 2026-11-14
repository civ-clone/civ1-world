import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../../Terrains';
import {
  Coal,
  Fish,
  Game,
  Gems,
  Gold,
  Horse,
  Oasis,
  Oil,
  Seal,
  Shield,
} from '../../TerrainFeatures';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  Feature,
  feature,
} from '@civ-clone/core-terrain-feature/Rules/Feature';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';

// How often a Grassland (or River) square has a Shield. The Grassland a Jungle or a Swamp is cleared to rolls at the
//  same odds (`Rules/Tile/terrain-changed`).
export const SHIELD_CHANCE = 0.5;

export const getRules: (
  terrainFeatureRegistry?: TerrainFeatureRegistry
) => Feature[] = (
  terrainFeatureRegistry: TerrainFeatureRegistry = terrainFeatureRegistryInstance
): Feature[] => {
  const baseChance = 0.2;

  return [
    ...(
      [
        [Coal, baseChance, Hills],
        [Fish, baseChance, Ocean],
        [Game, baseChance, Forest, Tundra],
        [Gems, baseChance, Jungle],
        [Gold, baseChance, Mountains],
        [Horse, baseChance, Plains],
        [Oasis, baseChance, Desert],
        [Oil, baseChance, Swamp],
        [Seal, baseChance, Arctic],
        [Shield, SHIELD_CHANCE, Grassland, River],
      ] as [typeof TerrainFeature, number, ...(typeof Terrain)[]][]
    ).flatMap(
      ([FeatureType, chance, ...terrains]: [
        typeof TerrainFeature,
        number,
        ...(typeof Terrain)[]
      ]): Feature[] =>
        terrains.flatMap((TerrainType: typeof Terrain) =>
          feature(TerrainType, FeatureType, chance, terrainFeatureRegistry)
        )
    ),
  ];
};

export default getRules;
