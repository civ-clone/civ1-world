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

const startTileCache = new Map<World, Tile[]>(),
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
        .filter((tile: Tile) =>
          [Grassland, Plains, River].some(
            (TerrainType) => tile.terrain() instanceof TerrainType
          )
        )
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
  };

export const getRules = (
  earthStartTileRegistry: EarthStartTileRegistry = earthStartTileRegistryInstance,
  engine: Engine = engineInstance,
  randomNumberGenerator: () => number = () => Math.random()
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

      const startingSquares = pickStartTiles(world, engine);

      startingSquares.forEach((tile: Tile) => {
        if (
          usedStartSquares.some(
            (startSquare: Tile): boolean => startSquare.distanceFrom(tile) <= 4
          )
        ) {
          startingSquares.splice(startingSquares.indexOf(tile), 1);
        }
      });

      return startingSquares[
        Math.floor(startingSquares.length * randomNumberGenerator())
      ];
    })
  ),
];

export default getRules;
