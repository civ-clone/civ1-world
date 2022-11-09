"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Terrains_1 = require("../../Terrains");
const TileImprovements_1 = require("../../TileImprovements");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Available_1 = require("@civ-clone/core-tile-improvement/Rules/Available");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => [
    // Improvement requires a specific terrain type
    ...[
        [TileImprovements_1.Irrigation, Terrains_1.Desert, Terrains_1.Grassland, Terrains_1.Hills, Terrains_1.Plains, Terrains_1.River],
        [TileImprovements_1.Mine, Terrains_1.Desert, Terrains_1.Hills, Terrains_1.Mountains],
        [
            TileImprovements_1.Road,
            Terrains_1.Arctic,
            Terrains_1.Desert,
            Terrains_1.Forest,
            Terrains_1.Grassland,
            Terrains_1.Hills,
            Terrains_1.Jungle,
            Terrains_1.Mountains,
            Terrains_1.Plains,
            Terrains_1.Swamp,
            Terrains_1.Tundra,
        ],
    ].map(([Improvement, ...AvailableTerrains]) => new Available_1.default(new Criterion_1.default((tile, AvailableTileImprovement) => AvailableTileImprovement === Improvement), new Criterion_1.default((tile) => AvailableTerrains.some((Terrain) => tile.terrain() instanceof Terrain)), new Criterion_1.default((tile, AvailableTileImprovement) => !tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof AvailableTileImprovement)))),
    // Improvement requires a specific terrain type and an advance
    ...[[TileImprovements_1.Road, Advances_1.BridgeBuilding, Terrains_1.River]].map(([Improvement, RequiredAdvance, ...AvailableTerrains]) => new Available_1.default(new Criterion_1.default((tile, AvailableTileImprovement) => AvailableTileImprovement === Improvement), new Criterion_1.default((tile) => AvailableTerrains.some((TerrainType) => tile.terrain() instanceof TerrainType)), new Criterion_1.default((tile, AvailableTileImprovement) => !tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof AvailableTileImprovement)), new Criterion_1.default((tile, AvailableTileImprovement, player) => playerResearchRegistry
        .getByPlayer(player)
        .completed(RequiredAdvance)))),
    // Improvement requires a specific terrain type, an existing improvement and an advance
    ...[
        [
            TileImprovements_1.Railroad,
            Advances_1.Railroad,
            TileImprovements_1.Road,
            Terrains_1.Arctic,
            Terrains_1.Desert,
            Terrains_1.Forest,
            Terrains_1.Grassland,
            Terrains_1.Hills,
            Terrains_1.Jungle,
            Terrains_1.Mountains,
            Terrains_1.Plains,
            Terrains_1.River,
            Terrains_1.Swamp,
            Terrains_1.Tundra,
        ],
    ].map(([Improvement, RequiredAdvance, RequiredImprovement, ...AvailableTerrains]) => new Available_1.default(new Criterion_1.default((tile, AvailableTileImprovement) => AvailableTileImprovement === Improvement), new Criterion_1.default((tile) => AvailableTerrains.some((TerrainType) => tile.terrain() instanceof TerrainType)), new Criterion_1.default((tile, AvailableTileImprovement) => !tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof AvailableTileImprovement)), new Criterion_1.default((tile) => tileImprovementRegistry
        .getByTile(tile)
        .some((tileImprovement) => tileImprovement instanceof RequiredImprovement)), new Criterion_1.default((tile, AvailableTileImprovement, player) => playerResearchRegistry
        .getByPlayer(player)
        .completed(RequiredAdvance)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=available.js.map