"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Terrains_1 = require("../../Terrains");
const TerrainFeatures_1 = require("../../TerrainFeatures");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const Feature_1 = require("@civ-clone/core-terrain-feature/Rules/Feature");
const getRules = (terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => {
    const baseChance = 0.2;
    return [
        ...[
            [TerrainFeatures_1.Coal, baseChance, Terrains_1.Hills],
            [TerrainFeatures_1.Fish, baseChance, Terrains_1.Ocean],
            [TerrainFeatures_1.Game, baseChance, Terrains_1.Forest, Terrains_1.Tundra],
            [TerrainFeatures_1.Gems, baseChance, Terrains_1.Jungle],
            [TerrainFeatures_1.Gold, baseChance, Terrains_1.Mountains],
            [TerrainFeatures_1.Horse, baseChance, Terrains_1.Plains],
            [TerrainFeatures_1.Oasis, baseChance, Terrains_1.Desert],
            [TerrainFeatures_1.Oil, baseChance, Terrains_1.Swamp],
            [TerrainFeatures_1.Seal, baseChance, Terrains_1.Arctic],
            [TerrainFeatures_1.Shield, 0.5, Terrains_1.Grassland, Terrains_1.River],
        ].flatMap(([FeatureType, chance, ...terrains]) => terrains.flatMap((TerrainType) => (0, Feature_1.feature)(TerrainType, FeatureType, chance, terrainFeatureRegistry))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=feature.js.map