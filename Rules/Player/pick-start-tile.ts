import {
  EarthStartTileRegistry,
  instance as earthStartTileRegistryInstance,
} from '@civ-clone/civ1-earth-generator/EarthStartTileRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import { Food, Trade, Production } from '../../Yields';
import { Grassland, Plains, River } from '../../Terrains';
import Effect from '@civ-clone/core-rule/Effect';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import { instance as rngInstance } from '@civ-clone/core-random';

// v474.05 only starts a civilization on a continent with at least this many
// Grassland, Plains or River tiles.
export const minimumBuildableTiles = 32;

const startTerrains = [Grassland, Plains, River],
  isStartTerrain = (tile: Tile): boolean =>
    startTerrains.some((TerrainType) => tile.terrain() instanceof TerrainType),
  startTileCache = new Map<World, Tile[]>(),
  buildableTilesCache = new Map<World, Map<Tile, number>>(),
  tileScoreCache: Map<Tile, number> = new Map(),
  areaScoreCache: Map<Tile, number> = new Map(),
  tileScore = (tile: Tile, player: Player | null = null): number => {
    if (!tileScoreCache.has(tile)) {
      tileScoreCache.set(
        tile,
        tile.score(player, [
          [Food, 8],
          [Production, 3],
          [Trade, 1],
        ])
      );
    }

    return tileScoreCache.get(tile)!;
  },
  areaScore = (tile: Tile, player: Player | null = null): number => {
    if (!areaScoreCache.has(tile)) {
      areaScoreCache.set(
        tile,
        tile
          .getSurroundingArea()
          .entries()
          .reduce(
            (total: number, tile: Tile): number =>
              total + tileScore(tile, player),
            0
          )
      );
    }

    return areaScoreCache.get(tile)!;
  },
  pickStartTiles = (world: World, engine: Engine = engineInstance) => {
    if (!startTileCache.has(world)) {
      engine.emit('world:generate-start-tiles');

      const startingSquares = world
        .entries()
        .filter(isStartTerrain)
        .map((tile: Tile) => ({
          tile,
          score: areaScore(tile),
        }))
        .sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)
        .map(({ tile }) => tile);

      startTileCache.set(world, startingSquares);

      engine.emit('world:start-tiles', startingSquares);
    }

    return startTileCache.get(world)!;
  },
  // How many start-terrain tiles are on each tile's landmass.
  buildableTiles = (world: World): Map<Tile, number> => {
    if (!buildableTilesCache.has(world)) {
      const counts = new Map<Tile, number>();

      world.landMasses().forEach((landMass) => {
        const tiles = landMass.tiles(),
          count = tiles.filter(isStartTerrain).length;

        tiles.forEach((tile) => counts.set(tile, count));
      });

      buildableTilesCache.set(world, counts);
    }

    return buildableTilesCache.get(world)!;
  };

export const getRules = (
  earthStartTileRegistry: EarthStartTileRegistry = earthStartTileRegistryInstance,
  engine: Engine = engineInstance,
  randomNumberGenerator: () => number = rngInstance
): PickStartTile[] => [
  new PickStartTile(
    new Effect((world: World, player: Player, usedStartSquares: Tile[]) => {
      if (engine.option('earth', false)) {
        try {
          return earthStartTileRegistry.getStartTileByCivilizationAndWorld(
            player.civilization().sourceClass(),
            world
          );
        } catch (e) {
          // TODO: The Civilization isn't registered, this might pose problems if the random selection are fixed start
          //  tiles, ideally we'd defer this selection until other `Player`s have picked.
          usedStartSquares.push(
            ...earthStartTileRegistry
              .entries()
              .map((startTile) => startTile.startTileForMap(world))
          );
        }
      }

      const counts = buildableTiles(world),
        freeSquares = pickStartTiles(world, engine).filter(
          (tile: Tile): boolean =>
            !usedStartSquares.some(
              (startSquare: Tile): boolean =>
                startSquare.distanceFrom(tile) <= 4
            )
        ),
        roomySquares = freeSquares.filter(
          (tile: Tile): boolean =>
            (counts.get(tile) ?? 0) >= minimumBuildableTiles
        ),
        // With no room anywhere, start on whichever landmass has the most.
        most = freeSquares.reduce(
          (most: number, tile: Tile): number =>
            Math.max(most, counts.get(tile) ?? 0),
          0
        ),
        startingSquares =
          roomySquares.length > 0
            ? roomySquares
            : freeSquares.filter(
                (tile: Tile): boolean => (counts.get(tile) ?? 0) === most
              );

      return startingSquares[
        Math.floor(startingSquares.length * randomNumberGenerator())
      ];
    })
  ),
];

export default getRules;
