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
        [Shield, 0.5, Grassland, River],
      ] as [typeof TerrainFeature, number, ...typeof Terrain[]][]
    ).flatMap(
      ([FeatureType, chance, ...terrains]: [
        typeof TerrainFeature,
        number,
        ...typeof Terrain[]
      ]): Feature[] =>
        terrains.flatMap((TerrainType: typeof Terrain) =>
          feature(TerrainType, FeatureType, chance, terrainFeatureRegistry)
        )
    ),
  ];
};

export default getRules;
