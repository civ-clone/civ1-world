"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.CLEAR_YIELD_CACHE = exports.TO_GRASSLAND = exports.TO_FOREST = exports.FOREST_TO_PLAINS = void 0;
const Terrains_1 = require("../../Terrains");
const TerrainFeatures_1 = require("../../TerrainFeatures");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const replaceFeatures_1 = require("@civ-clone/base-terrain-feature/lib/replaceFeatures");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Feature_1 = require("@civ-clone/core-terrain-feature/Rules/Feature");
const TerrainChanged_1 = require("@civ-clone/core-world/Rules/TerrainChanged");
const changesTerrain_1 = require("@civ-clone/base-terrain-feature/lib/changesTerrain");
exports.FOREST_TO_PLAINS = 'civ1-world:terrain-changed/forest-to-plains';
exports.TO_FOREST = 'civ1-world:terrain-changed/to-forest';
exports.TO_GRASSLAND = 'civ1-world:terrain-changed/to-grassland';
exports.CLEAR_YIELD_CACHE = 'civ1-world:terrain-changed/clear-yield-cache';
/**
 * A `TerrainChanged` effect for a unit converting a square's terrain: the new
 * terrain is made before it is set, and made terrain rolls for its own
 * features (the `Created` rule), so whatever it rolled is taken off it first.
 * Then `replace` decides the square's features from the old terrain's, which
 * are all unregistered (civ-clone/web-renderer#1038).
 */
const convertFeatures = (terrainFeatureRegistry, replace) => (0, replaceFeatures_1.default)(terrainFeatureRegistry, (features, to, from, tile) => {
    const rolled = terrainFeatureRegistry.getByTerrain(to);
    if (rolled.length > 0) {
        terrainFeatureRegistry.unregister(...rolled);
    }
    return replace(features, to, from, tile);
});
/**
 * What a square's features become when a unit converts its terrain. As in
 * Civ1, a special resource stays with the square as the new terrain's own
 * special (civ-clone/web-renderer#281), a square without one stays without one,
 * and every feature of the old terrain is unregistered. Other terrain changes
 * leave the features where they are.
 *
 * A square's yields are worked out again after any terrain change.
 *
 * TODO: these treat every feature as a special. When rivers arrive as a
 *  `Watercourse` feature (civ-clone/web-renderer#1008, G15), exclude them here
 *  (`isResource` from base-terrain-feature) and carry them over instead.
 */
const getRules = (terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance) => [
    // Clearing a Forest: its Game becomes Horses on the Plains.
    new TerrainChanged_1.default(exports.FOREST_TO_PLAINS, new Criterion_1.default((0, changesTerrain_1.default)([Terrains_1.Forest], [Terrains_1.Plains])), new Effect_1.default(convertFeatures(terrainFeatureRegistry, (features, to) => features.length > 0 ? [new TerrainFeatures_1.Horse(to)] : []))),
    // Planting a Forest: Oil, Gems or Horses become Game. Grassland's Shield isn't a special resource, so it doesn't
    //  carry over.
    new TerrainChanged_1.default(exports.TO_FOREST, new Criterion_1.default((0, changesTerrain_1.default)([Terrains_1.Plains, Terrains_1.Grassland, Terrains_1.Jungle, Terrains_1.Swamp], [Terrains_1.Forest])), new Effect_1.default(convertFeatures(terrainFeatureRegistry, (features, to) => features.some((feature) => !(feature instanceof TerrainFeatures_1.Shield))
        ? [new TerrainFeatures_1.Game(to)]
        : []))),
    // Clearing a Jungle or a Swamp: its special is lost, and the Grassland rolls for a Shield, here and only here. Any
    //  Shield it was given before (when it was made, or by the conversion itself) has been taken off it, so the odds
    //  are the Shield rule's own whatever made the conversion.
    new TerrainChanged_1.default(exports.TO_GRASSLAND, new Criterion_1.default((0, changesTerrain_1.default)([Terrains_1.Jungle, Terrains_1.Swamp], [Terrains_1.Grassland])), new Effect_1.default(convertFeatures(terrainFeatureRegistry, (features, to) => {
        ruleRegistry.process(Feature_1.default, TerrainFeatures_1.Shield, to);
        return [];
    }))),
    // Nothing else works a square's yields out again when its terrain changes (`Tile.setTerrain` doesn't, and nothing
    //  clears the cache at the start of a turn), so the old terrain's yields would stay, for nobody and for each player.
    new TerrainChanged_1.default(exports.CLEAR_YIELD_CACHE, new Effect_1.default((tile) => {
        tile.clearYieldCache(null);
        playerRegistry.forEach((player) => tile.clearYieldCache(player));
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=terrain-changed.js.map