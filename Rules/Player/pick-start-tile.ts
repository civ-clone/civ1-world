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
import StartTilePicker from '@civ-clone/base-world-start/lib/StartTilePicker';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import civ1Distance from '../../lib/civ1Distance';
import { instance as rngInstance } from '@civ-clone/core-random';

// v474.05 only starts a civilization on a continent with at least this many
// Grassland, Plains or River tiles.
export const minimumBuildableTiles = 32;

// One picker for every world, so each is ranked once: on Grassland, Plains or River, by the food, production and trade
//  around it, at least 4 apart.
const picker = new StartTilePicker({
  TerrainTypes: [Grassland, Plains, River],
  weights: [
    [Food, 8],
    [Production, 3],
    [Trade, 1],
  ],
  minimumRoom: minimumBuildableTiles,
  tooClose: (startSquare: Tile, tile: Tile): boolean =>
    civ1Distance(startSquare, tile) <= 4,
});

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

      return picker.pick(
        world,
        usedStartSquares,
        engine,
        randomNumberGenerator
      );
    })
  ),
];

export default getRules;
