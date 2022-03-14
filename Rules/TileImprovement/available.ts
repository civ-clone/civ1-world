import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../../Terrains';
import { Irrigation, Mine, Railroad, Road } from '../../TileImprovements';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  BridgeBuilding,
  Railroad as RailroadAdvance,
} from '@civ-clone/civ1-science/Advances';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Advance from '@civ-clone/core-science/Advance';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
import Criterion from '@civ-clone/core-rule/Criterion';
import Player from '@civ-clone/core-player/Player';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';

export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  tileImprovementRegistry?: TileImprovementRegistry
) => Available[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
): Available[] => [
  ...(
    [
      [Irrigation, Desert, Grassland, Hills, Plains, River],
      [Mine, Desert, Hills, Mountains],
      [
        Road,
        Arctic,
        Desert,
        Forest,
        Grassland,
        Hills,
        Jungle,
        Mountains,
        Plains,
        Swamp,
        Tundra,
      ],
    ] as [typeof TileImprovement, ...typeof Terrain[]][]
  ).map(
    ([Improvement, ...terrains]: [
      typeof TileImprovement,
      ...typeof Terrain[]
    ]): Available =>
      new Available(
        new Criterion(
          (
            tile: Tile,
            AvailableTileImprovement: typeof TileImprovement
          ): boolean => AvailableTileImprovement === Improvement
        ),
        new Criterion(
          (
            tile: Tile,
            AvailableTileImprovement: typeof TileImprovement
          ): boolean =>
            !tileImprovementRegistry
              .getByTile(tile)
              .some(
                (improvement: TileImprovement): boolean =>
                  improvement instanceof AvailableTileImprovement
              )
        ),
        new Criterion((tile: Tile): boolean =>
          terrains.some((Terrain) => tile.terrain() instanceof Terrain)
        )
      )
  ),

  ...(
    [[Road, BridgeBuilding, River]] as [
      typeof TileImprovement,
      typeof Advance,
      typeof Terrain
    ][]
  ).map(
    ([Improvement, RequiredAdvance, AvailableTerrain]: [
      typeof TileImprovement,
      typeof Advance,
      typeof Terrain
    ]): Available =>
      new Available(
        new Criterion(
          (
            tile: Tile,
            AvailableTileImprovement: typeof TileImprovement
          ): boolean => AvailableTileImprovement === Improvement
        ),
        new Criterion(
          (
            tile: Tile,
            AvailableTileImprovement: typeof TileImprovement,
            player: Player
          ): boolean =>
            playerResearchRegistry
              .getByPlayer(player)
              .completed(RequiredAdvance)
        ),
        new Criterion(
          (tile: Tile): boolean => tile.terrain() instanceof AvailableTerrain
        )
      )
  ),

  ...(
    [[Railroad, RailroadAdvance, Road]] as [
      typeof TileImprovement,
      typeof Advance,
      typeof TileImprovement
    ][]
  ).map(
    ([Improvement, RequiredAdvance, RequiredImprovement]: [
      typeof TileImprovement,
      typeof Advance,
      typeof TileImprovement
    ]): Available =>
      new Available(
        new Criterion(
          (
            tile: Tile,
            AvailableTileImprovement: typeof TileImprovement
          ): boolean => AvailableTileImprovement === Improvement
        ),
        new Criterion(
          (
            tile: Tile,
            AvailableTileImprovement: typeof TileImprovement,
            player: Player
          ): boolean =>
            playerResearchRegistry
              .getByPlayer(player)
              .completed(RequiredAdvance)
        ),
        new Criterion((tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (tileImprovement) =>
                tileImprovement instanceof RequiredImprovement
            )
        )
      )
  ),
];

export default getRules;
