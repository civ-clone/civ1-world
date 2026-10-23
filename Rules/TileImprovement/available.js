"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.deriveAvailableRules = exports.availableRulesFor = void 0;
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Advance_1 = require("@civ-clone/core-science/Advance");
const Available_1 = require("@civ-clone/core-tile-improvement/Rules/Available");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const TileImprovement_1 = require("@civ-clone/core-tile-improvement/TileImprovement");
const Requirements_1 = require("../../Requirements");
/**
 * The rule `entry` is played by: its tile improvement can go on a tile of one of the terrains it lists (`where`, any
 * terrain when it lists none), that doesn't have one already, with each tile improvement it `requires` on the tile and
 * each advance it `requires` discovered by the player building it: the entry's range is the tile, and an advance is
 * the working player's. A tile improvement can be built by any one of its rules (`Available`'s consumers take any
 * that passes), so each entry is one way to build it, needing all of its targets. An entry this can't play (`any` of
 * its targets, or a target that is neither a tile improvement nor an advance) is refused rather than played wrongly.
 */
const availableRulesFor = (entry, playerResearchRegistry = PlayerResearchRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => {
    if (entry.relation !== 'requires') {
        return [];
    }
    const Improvement = entry.subject, terrains = entry.where, isImprovement = (target) => Object.prototype.isPrototypeOf.call(TileImprovement_1.default, target), isAdvance = (target) => Object.prototype.isPrototypeOf.call(Advance_1.default, target);
    if (entry.mode !== 'all') {
        throw new TypeError(`'${entry.id}': a way to build a tile improvement needs all of its targets, so its mode must be 'all'.`);
    }
    const unplayable = entry.targets.filter((target) => !isImprovement(target) && !isAdvance(target));
    if (unplayable.length > 0) {
        throw new TypeError(`'${entry.id}': a tile improvement can need other tile improvements and advances, not ${unplayable
            .map((target) => { var _a; return (_a = target.id) !== null && _a !== void 0 ? _a : target.name; })
            .join(', ')}.`);
    }
    const improvements = entry.targets.filter(isImprovement), advances = entry.targets.filter(isAdvance);
    return [
        new Available_1.default(entry.id, new Criterion_1.default((tile, AvailableTileImprovement) => AvailableTileImprovement === Improvement), new Criterion_1.default((tile) => terrains === null ||
            terrains.some((TerrainType) => tile.terrain() instanceof TerrainType)), new Criterion_1.default((tile, AvailableTileImprovement) => !tileImprovementRegistry
            .getByTile(tile)
            .some((improvement) => improvement instanceof AvailableTileImprovement)), ...improvements.map((RequiredImprovement) => new Criterion_1.default((tile) => tileImprovementRegistry
            .getByTile(tile)
            .some((tileImprovement) => tileImprovement instanceof RequiredImprovement))), ...advances.map((RequiredAdvance) => new Criterion_1.default((tile, AvailableTileImprovement, player) => playerResearchRegistry
            .getByPlayer(player)
            .completed(RequiredAdvance)))),
    ];
};
exports.availableRulesFor = availableRulesFor;
/** What `registerRules` gives the game's `requirements` to make each entry's rule with. */
const deriveAvailableRules = (playerResearchRegistry, tileImprovementRegistry) => (entry) => (0, exports.availableRulesFor)(entry, playerResearchRegistry, tileImprovementRegistry);
exports.deriveAvailableRules = deriveAvailableRules;
/**
 * Every rule about where tile improvements can go, as `registerRules` registers them: one for each of `Requirements`'
 * entries. For a rule registry without a game's `requirements` (tests): a game's are registered through
 * `game.requirements`, so a plugin can change an entry and its rule together.
 */
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => Requirements_1.default.flatMap((entry) => (0, exports.availableRulesFor)(entry, playerResearchRegistry, tileImprovementRegistry));
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=available.js.map