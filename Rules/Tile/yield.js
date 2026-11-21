"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.roadTradeTerrains = exports.ROAD_TRADE = exports.RIVER_TRADE = exports.OCEAN_TRADE = void 0;
const TerrainFeatures_1 = require("../../TerrainFeatures");
const Terrains_1 = require("../../Terrains");
const Yields_1 = require("../../Yields");
const TileImprovements_1 = require("../../TileImprovements");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Description_1 = require("@civ-clone/core-rule/Description");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yield_1 = require("@civ-clone/core-world/Rules/Yield");
/** The trade each Ocean square gives. */
exports.OCEAN_TRADE = 2;
/** The trade each River square gives. */
exports.RIVER_TRADE = 1;
/** The trade a Road adds on the terrains in `roadTradeTerrains`. */
exports.ROAD_TRADE = 1;
/** The terrains a Road adds `ROAD_TRADE` to. */
exports.roadTradeTerrains = [
    Terrains_1.Desert,
    Terrains_1.Grassland,
    Terrains_1.Plains,
];
const getRules = (tileImprovementRegistry = TileImprovementRegistry_1.instance, terrainFeatureRegistry = TerrainFeatureRegistry_1.instance) => [
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
    ].map(([YieldType, TerrainType, value]) => new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof TerrainType), new Effect_1.default(() => new YieldType(value, TerrainType.name)), 
    // What it gives, for the Civilopedia (civ-clone/web-renderer#620).
    new Description_1.default({
        type: 'terrain_yield',
        subject: TerrainType,
        yield: YieldType,
        value,
    }))),
    // The special resources' yields, which replace the terrain's in v474.05's table (`GameData.cs` L322-333): Coal is
    //  1/2/0 on Hills, Gold 0/1/6 on Mountains, and so on.
    ...[
        [Yields_1.Production, TerrainFeatures_1.Coal, 2],
        [Yields_1.Food, TerrainFeatures_1.Fish, 2],
        [Yields_1.Food, TerrainFeatures_1.Game, 2],
        [Yields_1.Trade, TerrainFeatures_1.Gems, 4],
        [Yields_1.Trade, TerrainFeatures_1.Gold, 6],
        [Yields_1.Production, TerrainFeatures_1.Horse, 2],
        [Yields_1.Food, TerrainFeatures_1.Oasis, 3],
        [Yields_1.Production, TerrainFeatures_1.Oil, 4],
        [Yields_1.Food, TerrainFeatures_1.Seal, 2],
        [Yields_1.Production, TerrainFeatures_1.Shield, 1],
    ].map(([YieldType, Feature, value]) => new Yield_1.default(new Criterion_1.default((tile) => terrainFeatureRegistry
        .getByTerrain(tile.terrain())
        .some((feature) => feature instanceof Feature)), new Effect_1.default(() => new YieldType(value, Feature.name)))),
    new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof Terrains_1.Ocean), new Effect_1.default(() => new Yields_1.Trade(exports.OCEAN_TRADE, Terrains_1.Ocean.name)), new Description_1.default({
        type: 'terrain_yield',
        subject: Terrains_1.Ocean,
        yield: Yields_1.Trade,
        value: exports.OCEAN_TRADE,
    })),
    new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof Terrains_1.River), new Effect_1.default(() => new Yields_1.Trade(exports.RIVER_TRADE)), new Description_1.default({
        type: 'terrain_yield',
        subject: Terrains_1.River,
        yield: Yields_1.Trade,
        value: exports.RIVER_TRADE,
    })),
    // Irrigation and mines, as v474.05 applies them (`-1 - IrrigationEffect`, `-1 - MiningEffect` from `GameData.cs`
    //  L295-306), whatever the government: what Anarchy and Despotism take off is the tile modifier's
    //  (civ-clone/web-renderer#401).
    ...[
        [Terrains_1.Desert, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.Desert, Yields_1.Production, TileImprovements_1.Mine, 1],
        [Terrains_1.Grassland, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.Hills, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.Hills, Yields_1.Production, TileImprovements_1.Mine, 3],
        [Terrains_1.Mountains, Yields_1.Production, TileImprovements_1.Mine, 1],
        [Terrains_1.Plains, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.River, Yields_1.Food, TileImprovements_1.Irrigation, 1],
    ].map(([ImprovedTerrain, YieldType, Improvement, value]) => new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof ImprovedTerrain), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof Improvement)), new Effect_1.default(() => new YieldType(value, Improvement.name)), new Description_1.default({
        type: 'improvement_yield',
        subject: ImprovedTerrain,
        yield: YieldType,
        value,
        improvement: Improvement,
    }))),
    ...exports.roadTradeTerrains.map((TerrainType) => new Yield_1.default(new Criterion_1.default((tile) => tile.terrain() instanceof TerrainType), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Road)), new Effect_1.default(() => new Yields_1.Trade(exports.ROAD_TRADE, TileImprovements_1.Road.name)), new Description_1.default({
        type: 'improvement_yield',
        subject: TerrainType,
        yield: Yields_1.Trade,
        value: exports.ROAD_TRADE,
        improvement: TileImprovements_1.Road,
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map