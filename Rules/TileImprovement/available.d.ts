import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Available from '@civ-clone/core-tile-improvement/Rules/Available';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
/**
 * The rule `entry` is played by: its tile improvement can go on a tile of one of the terrains it lists (`where`, any
 * terrain when it lists none), that doesn't have one already, with each tile improvement it `requires` on the tile and
 * each advance it `requires` discovered by the player building it: the entry's range is the tile, and an advance is
 * the working player's. A tile improvement can be built by any one of its rules (`Available`'s consumers take any
 * that passes), so each entry is one way to build it, needing all of its targets. An entry this can't play (`any` of
 * its targets, or a target that is neither a tile improvement nor an advance) is refused rather than played wrongly.
 */
export declare const availableRulesFor: (
  entry: Requirement,
  playerResearchRegistry?: PlayerResearchRegistry,
  tileImprovementRegistry?: TileImprovementRegistry
) => Available[];
/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
export declare const deriveAvailableRules: (
  playerResearchRegistry: PlayerResearchRegistry,
  tileImprovementRegistry: TileImprovementRegistry
) => Deriver;
/**
 * Every rule about where tile improvements can go, as `registerRules` registers them: one for each of `Requirements`'
 * entries. For a rule registry without a game's `requirements` (tests): a game's are registered through
 * `game.requirements`, so a plugin can change an entry and its rule together.
 */
export declare const getRules: (
  playerResearchRegistry?: PlayerResearchRegistry,
  tileImprovementRegistry?: TileImprovementRegistry
) => Available[];
export default getRules;
