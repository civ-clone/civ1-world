"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.TO_GRASSLAND = exports.TO_FOREST = exports.FOREST_TO_PLAINS = void 0;
const Terrains_1 = require("../../Terrains");
const TerrainFeatures_1 = require("../../TerrainFeatures");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TerrainChanged_1 = require("@civ-clone/core-world/Rules/TerrainChanged");
const changesTerrain_1 = require("@civ-clone/base-terrain-feature/lib/changesTerrain");
const replaceFeatures_1 = require("@civ-clone/base-terrain-feature/lib/replaceFeatures");
exports.FOREST_TO_PLAINS = 'civ1-world:terrain-changed/forest-to-plains';
exports.TO_FOREST = 'civ1-world:terrain-changed/to-forest';
exports.TO_GRASSLAND = 'civ1-world:terrain-changed/to-grassland';
/**
 * What a square's features become when a unit converts its terrain. A special
 * resource stays with the square as the new terrain's own special
 * (civ-clone/web-renderer#281), and every feature of the old terrain is
 * unregistered. Other terrain changes leave the features where they are.
 *
 * TODO: these treat every feature as a special. When rivers arrive as a
 *  `Watercourse` feature (civ-clone/web-renderer#1008, G15), exclude them here
 *  (`isResource` from base-terrain-feature) and carry them over instead.
 */
const getRules = (terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => [
    // Clearing a Forest: its Game becomes Horses on the Plains.
    new TerrainChanged_1.default(exports.FOREST_TO_PLAINS, new Criterion_1.default((0, changesTerrain_1.default)([Terrains_1.Forest], [Terrains_1.Plains])), new Effect_1.default((0, replaceFeatures_1.default)(terrainFeatureRegistry, (features, to) => features.length > 0 ? [new TerrainFeatures_1.Horse(to)] : []))),
    // Planting a Forest: Oil, Gems or Horses become Game. Grassland's Shield isn't a special resource, so it doesn't
    //  carry over.
    new TerrainChanged_1.default(exports.TO_FOREST, new Criterion_1.default((0, changesTerrain_1.default)([Terrains_1.Plains, Terrains_1.Grassland, Terrains_1.Jungle, Terrains_1.Swamp], [Terrains_1.Forest])), new Effect_1.default((0, replaceFeatures_1.default)(terrainFeatureRegistry, (features, to) => features.some((feature) => !(feature instanceof TerrainFeatures_1.Shield))
        ? [new TerrainFeatures_1.Game(to)]
        : []))),
    // Clearing a Jungle or a Swamp: its special is lost. The conversion itself rolls the Grassland for a Shield before
    //  it sets the terrain, as it always did, so a released conversion and these rules never roll twice.
    new TerrainChanged_1.default(exports.TO_GRASSLAND, new Criterion_1.default((0, changesTerrain_1.default)([Terrains_1.Jungle, Terrains_1.Swamp], [Terrains_1.Grassland])), new Effect_1.default((0, replaceFeatures_1.default)(terrainFeatureRegistry, () => []))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=terrain-changed.js.map