"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const TerrainFeatures_1 = require("../../TerrainFeatures");
const Terrains_1 = require("../../Terrains");
const Yields_1 = require("../../Yields");
const TileImprovements_1 = require("../../TileImprovements");
const Governments_1 = require("@civ-clone/civ1-government/Governments");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yield_1 = require("@civ-clone/core-world/Rules/Yield");
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance) => [
    ...[
        [Yields_1.Food, Terrains_1.Forest, 1],
        [Yields_1.Food, Terrains_1.Grassland, 2],
        [Yields_1.Food, Terrains_1.Hills, 1],
        [Yields_1.Food, Terrains_1.Jungle, 1],
        [Yields_1.Food, Terrains_1.Ocean, 1],
        [Yields_1.Food, Terrains_1.Plains, 1],
        [Yields_1.Food, Terrains_1.River, 2],
        [Yields_1.Food, Terrains_1.Swamp, 1],
        [Yields_1.Food, Terrains_1.Tundra, 1],
        [Yields_1.Production, Terrains_1.Desert, 1],
        [Yields_1.Production, Terrains_1.Forest, 2],
        [Yields_1.Production, Terrains_1.Mountains, 1],
        [Yields_1.Production, Terrains_1.Plains, 1],
    ].map(([YieldType, TerrainType, value]) => new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof TerrainType), new Effect_1.default(() => new YieldType(value, TerrainType.name)))),
    ...[
        [Yields_1.Production, TerrainFeatures_1.Coal, 2],
        [Yields_1.Food, TerrainFeatures_1.Fish, 1],
        [Yields_1.Food, TerrainFeatures_1.Game, 1],
        [Yields_1.Trade, TerrainFeatures_1.Gems, 2],
        [Yields_1.Trade, TerrainFeatures_1.Gold, 3],
        [Yields_1.Production, TerrainFeatures_1.Horse, 1],
        [Yields_1.Food, TerrainFeatures_1.Oasis, 2],
        [Yields_1.Production, TerrainFeatures_1.Oil, 3],
        [Yields_1.Food, TerrainFeatures_1.Seal, 2],
        [Yields_1.Production, TerrainFeatures_1.Shield, 1],
    ].map(([YieldType, Feature, value]) => new Yield_1.default(new Criterion_1.default((tile) => terrainFeatureRegistry
        .getByTerrain(tile.terrain())
        .some((feature) => feature instanceof Feature)), new Effect_1.default(() => new YieldType(value, Feature.name)))),
    ...[
        [Yields_1.Production, TerrainFeatures_1.Coal, 1],
        [Yields_1.Food, TerrainFeatures_1.Fish, 1],
        [Yields_1.Food, TerrainFeatures_1.Game, 1],
        [Yields_1.Trade, TerrainFeatures_1.Gems, 2],
        [Yields_1.Trade, TerrainFeatures_1.Gold, 2],
        [Yields_1.Production, TerrainFeatures_1.Horse, 1],
        [Yields_1.Food, TerrainFeatures_1.Oasis, 1],
        [Yields_1.Production, TerrainFeatures_1.Oil, 1],
        [Yields_1.Food, TerrainFeatures_1.Seal, 1],
    ].map(([YieldType, Feature, value]) => new Yield_1.default(new Criterion_1.default((tile, player) => {
        if (!player) {
            return false;
        }
        try {
            return playerGovernmentRegistry
                .getByPlayer(player)
                .is(Governments_1.Communism, Governments_1.Democracy, Governments_1.Monarchy, Governments_1.Republic);
        }
        catch (e) {
            return false;
        }
    }), new Criterion_1.default((tile) => terrainFeatureRegistry
        .getByTerrain(tile.terrain())
        .some((feature) => feature instanceof Feature)), new Effect_1.default(() => new YieldType(value, Feature.name)))),
    new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof Terrains_1.Ocean), new Effect_1.default(() => new Yields_1.Trade(2, Terrains_1.Ocean.name))),
    new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof Terrains_1.River), new Effect_1.default(() => new Yields_1.Trade(1))),
    new Yield_1.default(new Criterion_1.default((tile, player) => {
        if (!player) {
            return false;
        }
        try {
            return playerGovernmentRegistry
                .getByPlayer(player)
                .is(Governments_1.Democracy, Governments_1.Republic);
        }
        catch (e) {
            return false;
        }
    }), new Criterion_1.default((tile) => tile.terrain() instanceof Terrains_1.River || tile.terrain() instanceof Terrains_1.Ocean), new Effect_1.default(() => new Yields_1.Trade(1, Terrains_1.Ocean.name))),
    ...[
        [Terrains_1.Desert, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.Desert, Yields_1.Production, TileImprovements_1.Mine, 1],
        [Terrains_1.Hills, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.Hills, Yields_1.Production, TileImprovements_1.Mine, 2],
        [Terrains_1.Mountains, Yields_1.Production, TileImprovements_1.Mine, 1],
        [Terrains_1.Plains, Yields_1.Food, TileImprovements_1.Irrigation, 1],
    ].map(([ImprovedTerrain, YieldType, Improvement, value]) => new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof ImprovedTerrain), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof Improvement)), new Effect_1.default(() => new YieldType(value, Improvement.name)))),
    ...[
        [Terrains_1.Desert, Yields_1.Production, TileImprovements_1.Mine, 1],
        [Terrains_1.Grassland, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.Hills, Yields_1.Production, TileImprovements_1.Mine, 1],
        [Terrains_1.Mountains, Yields_1.Production, TileImprovements_1.Mine, 1],
        [Terrains_1.River, Yields_1.Food, TileImprovements_1.Irrigation, 1],
    ].map(([ImprovedTerrain, YieldType, Improvement, value]) => new Yield_1.default(new Criterion_1.default((tile, player) => {
        if (!player) {
            return false;
        }
        try {
            return playerGovernmentRegistry
                .getByPlayer(player)
                .is(Governments_1.Communism, Governments_1.Democracy, Governments_1.Monarchy, Governments_1.Republic);
        }
        catch (e) {
            return false;
        }
    }), new Criterion_1.default((tile) => tile.terrain() instanceof ImprovedTerrain), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof Improvement)), new Effect_1.default(() => new YieldType(value, Improvement.name)))),
    ...[Terrains_1.Desert, Terrains_1.Grassland, Terrains_1.Plains].map((TerrainType) => new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof TerrainType), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Road)), new Effect_1.default(() => new Yields_1.Trade(1, TileImprovements_1.Road.name)))),
    ...[Terrains_1.Desert, Terrains_1.Grassland, Terrains_1.Plains].map((TerrainType) => new Yield_1.default(new Criterion_1.default((tile, player) => {
        if (!player) {
            return false;
        }
        try {
            return playerGovernmentRegistry
                .getByPlayer(player)
                .is(Governments_1.Democracy, Governments_1.Republic);
        }
        catch (e) {
            return false;
        }
    }), new Criterion_1.default((tile) => tile.terrain() instanceof TerrainType), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Road)), new Effect_1.default(() => new Yields_1.Trade(1, TileImprovements_1.Road.name)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map