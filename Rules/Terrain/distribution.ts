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
  Distribution,
  IDistribution,
} from '@civ-clone/core-world-generator/Rules/Distribution';
import { Land, Water } from '@civ-clone/core-terrain/Types';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Terrain from '@civ-clone/core-terrain/Terrain';

export const getRules: () => Distribution[] = (): Distribution[] => [
  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Arctic
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0,
        to: 0.01,
        fill: true,
      },
      {
        from: 0.01,
        to: 0.02,
      },
      {
        from: 0.98,
        to: 0.99,
      },
      {
        from: 0.99,
        to: 1,
        fill: true,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Desert
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.4,
        to: 0.45,
      },
      {
        from: 0.45,
        to: 0.55,
        coverage: 0.025,
        cluster: true,
        clusterChance: 0.1,
      },
      {
        from: 0.55,
        to: 0.6,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Forest
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.05,
        to: 0.2,
      },
      {
        from: 0.2,
        to: 0.4,
        cluster: true,
        clusterChance: 0.1,
        coverage: 0.1,
      },
      {
        from: 0.4,
        to: 0.6,
      },
      {
        from: 0.6,
        to: 0.8,
        cluster: true,
        clusterChance: 0.1,
        coverage: 0.1,
      },
      {
        from: 0.8,
        to: 0.95,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Grassland
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        fill: true,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Hills
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.1,
        to: 0.9,
        path: true,
        pathChance: 0.1,
        coverage: 0.06,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Jungle
    ),
    new Criterion((TerrainType: typeof Terrain, mapData) =>
      mapData.some((terrain) => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.3,
        to: 0.45,
        cluster: true,
        clusterChance: 0.2,
        coverage: 0.08,
      },
      {
        from: 0.55,
        to: 0.7,
        cluster: true,
        clusterChance: 0.2,
        coverage: 0.08,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Mountains
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.01,
        to: 0.1,
        coverage: 0.3,
        path: true,
      },
      {
        from: 0.1,
        to: 0.9,
        path: true,
      },
      {
        from: 0.9,
        to: 0.99,
        coverage: 0.3,
        path: true,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Ocean
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain.constructor === Water)
    ),
    new Effect((): IDistribution[] => [
      {
        fill: true,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Plains
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.01,
        to: 0.2,
        coverage: 0.3,
      },
      {
        from: 0.2,
        to: 0.4,
      },
      {
        from: 0.1,
        to: 0.4,
        cluster: true,
      },
      {
        from: 0.4,
        to: 0.6,
      },
      {
        from: 0.6,
        to: 0.8,
      },
      {
        from: 0.6,
        to: 0.9,
        cluster: true,
      },
      {
        from: 0.8,
        to: 0.99,
        coverage: 0.3,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === River
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.1,
        to: 0.9,
        coverage: 0.1,
        path: true,
        pathChance: 0.5,
      },
    ])
  ),

  new Distribution(
    new Criterion(
      (TerrainType: typeof Terrain): boolean => TerrainType === Swamp
    ),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.2,
        to: 0.4,
        cluster: true,
      },
      {
        from: 0.6,
        to: 0.8,
        cluster: true,
      },
    ])
  ),

  new Distribution(
    new Criterion((TerrainType: typeof Terrain) => TerrainType === Tundra),
    new Criterion((TerrainType: typeof Terrain, mapData: Terrain[]): boolean =>
      mapData.some((terrain: Terrain): boolean => terrain instanceof Land)
    ),
    new Effect((): IDistribution[] => [
      {
        from: 0.01,
        to: 0.15,
        cluster: true,
        coverage: 0.15,
      },
      {
        from: 0.85,
        to: 0.99,
        cluster: true,
        coverage: 0.15,
      },
    ])
  ),
];

export default getRules;
