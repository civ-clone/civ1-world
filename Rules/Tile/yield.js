"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const TerrainFeatures_1 = require("../../TerrainFeatures");
const Terrains_1 = require("../../Terrains");
const Yields_1 = require("../../Yields");
const TileImprovements_1 = require("../../TileImprovements");
const TerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/TerrainFeatureRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const Yield_1 = require("@civ-clone/core-world/Rules/Yield");
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
    ].map(([YieldType, TerrainType, value]) => new Yield_1.default(new Criterion_1.default((tileYield) => tileYield instanceof YieldType), new Criterion_1.default((tileYield, tile) => tile.terrain() instanceof TerrainType), new Effect_1.default((tileYield) => tileYield.add(value)))),
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
    ].map(([YieldType, Feature, value]) => new Yield_1.default(new Criterion_1.default((tileYield) => tileYield instanceof YieldType), new Criterion_1.default((tileYield, tile) => terrainFeatureRegistry
        .getByTerrain(tile.terrain())
        .some((feature) => feature instanceof Feature)), new Effect_1.default((tileYield) => tileYield.add(value)))),
    new Yield_1.default(new Priorities_1.High(), new Criterion_1.default((tileYield) => tileYield instanceof Yields_1.Trade), new Criterion_1.default((tileYield, tile) => tile.terrain() instanceof Terrains_1.Ocean), new Effect_1.default((tileYield) => tileYield.add(2))),
    new Yield_1.default(new Priorities_1.High(), new Criterion_1.default((tileYield) => tileYield instanceof Yields_1.Trade), new Criterion_1.default((tileYield, tile) => tile.terrain() instanceof Terrains_1.River), new Effect_1.default((tileYield) => tileYield.add(1))),
    ...[
        [Terrains_1.Desert, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.Desert, Yields_1.Production, TileImprovements_1.Mine, 1],
        [Terrains_1.Hills, Yields_1.Food, TileImprovements_1.Irrigation, 1],
        [Terrains_1.Hills, Yields_1.Production, TileImprovements_1.Mine, 2],
        [Terrains_1.Mountains, Yields_1.Production, TileImprovements_1.Mine, 2],
        [Terrains_1.Plains, Yields_1.Food, TileImprovements_1.Irrigation, 1],
    ].map(([ImprovedTerrain, YieldType, Improvement, value]) => new Yield_1.default(new Criterion_1.default((tileYield) => tileYield instanceof YieldType), new Criterion_1.default((tileYield, tile) => tile.terrain() instanceof ImprovedTerrain), new Criterion_1.default((tileYield, tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof Improvement)), new Effect_1.default((tileYield) => tileYield.add(value)))),
    ...[Terrains_1.Desert, Terrains_1.Grassland, Terrains_1.Plains].map((TerrainType) => new Yield_1.default(new Priorities_1.High(), new Criterion_1.default((tileYield) => tileYield instanceof Yields_1.Trade), new Criterion_1.default((tileYield, tile) => tile.terrain() instanceof TerrainType), new Criterion_1.default((tileYield, tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Road)), new Effect_1.default((tileYield) => tileYield.add(1)))),
    new Yield_1.default(new Criterion_1.default((tileYield, tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof TileImprovements_1.Railroad)), new Effect_1.default((tileYield) => tileYield.add(Math.floor(tileYield.value() * 0.5), TileImprovements_1.Railroad.name))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map