import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import { Requirement, Target } from '@civ-clone/core-requirement/Requirement';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Advance from '@civ-clone/core-science/Advance';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
import Criterion from '@civ-clone/core-rule/Criterion';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import availableRequirements from '../../Requirements';

/**
 * The rule `entry` is played by: its tile improvement can go on a tile of one of the terrains it lists (`where`), that
 * doesn't have one already, with each tile improvement it `requires` on the tile and each advance it `requires`
 * discovered by the player building it. A tile improvement can be built by any one of its rules (`Available`'s
 * consumers take any that passes), so each entry is one way to build it.
 */
export const availableRulesFor = (
  entry: Requirement,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
): Available[] => {
  if (entry.relation !== 'requires') {
    return [];
  }

  const Improvement = entry.subject as typeof TileImprovement,
    terrains = entry.where ?? [],
    isImprovement = (target: Target): boolean =>
      Object.prototype.isPrototypeOf.call(TileImprovement, target),
    improvements = entry.targets.filter(
      isImprovement
    ) as (typeof TileImprovement)[],
    advances = entry.targets.filter(
      (target: Target): boolean => !isImprovement(target)
    ) as (typeof Advance)[];

  return [
    new Available(
      entry.id,
      new Criterion(
        (
          tile: Tile,
          AvailableTileImprovement: typeof TileImprovement
        ): boolean => AvailableTileImprovement === Improvement
      ),
      new Criterion((tile: Tile): boolean =>
        terrains.some((TerrainType) => tile.terrain() instanceof TerrainType)
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
      ...improvements.map(
        (RequiredImprovement: typeof TileImprovement): Criterion =>
          new Criterion((tile: Tile): boolean =>
            tileImprovementRegistry
              .getByTile(tile)
              .some(
                (tileImprovement) =>
                  tileImprovement instanceof RequiredImprovement
              )
          )
      ),
      ...advances.map(
        (RequiredAdvance: typeof Advance): Criterion =>
          new Criterion(
            (
              tile: Tile,
              AvailableTileImprovement: typeof TileImprovement,
              player: Player
            ): boolean =>
              playerResearchRegistry
                .getByPlayer(player)
                .completed(RequiredAdvance)
          )
      )
    ),
  ];
};

/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
export const deriveAvailableRules =
  (
    playerResearchRegistry: PlayerResearchRegistry,
    tileImprovementRegistry: TileImprovementRegistry
  ): Deriver =>
  (entry: Requirement): Available[] =>
    availableRulesFor(entry, playerResearchRegistry, tileImprovementRegistry);

/**
 * Every rule about where tile improvements can go, as `registerRules` registers them: one for each of `Requirements`'
 * entries. For a rule registry without a game's `requirements` (tests): a game's are registered through
 * `game.requirements`, so a plugin can change an entry and its rule together.
 */
export const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  tileImprovementRegistry?: TileImprovementRegistry
) => Available[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
): Available[] =>
  availableRequirements.flatMap((entry: Requirement): Available[] =>
    availableRulesFor(entry, playerResearchRegistry, tileImprovementRegistry)
  );

export default getRules;
