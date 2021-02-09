"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Terrains_1 = require("../../Terrains");
const TileImprovements_1 = require("../../TileImprovements");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Available_1 = require("@civ-clone/core-tile-improvement/Rules/Available");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const getRules = (playerResearchRegistry = PlayerResearchRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance) => [
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
    ].map(([Improvement, ...terrains]) => new Available_1.default(new Criterion_1.default((tile, AvailableTileImprovement) => AvailableTileImprovement === Improvement), new Criterion_1.default((tile, AvailableTileImprovement) => !tileImprovementRegistry
        .getByTile(tile)
        .some((improvement) => improvement instanceof AvailableTileImprovement)), new Criterion_1.default((tile) => terrains.some((Terrain) => tile.terrain() instanceof Terrain)))),
    ...[[TileImprovements_1.Road, Advances_1.BridgeBuilding, Terrains_1.River]].map(([Improvement, RequiredAdvance, AvailableTerrain]) => new Available_1.default(new Criterion_1.default((tile, AvailableTileImprovement) => AvailableTileImprovement === Improvement), new Criterion_1.default((tile, AvailableTileImprovement, player) => playerResearchRegistry
        .getByPlayer(player)
        .completed(RequiredAdvance)), new Criterion_1.default((tile) => tile.terrain() instanceof AvailableTerrain))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=available.js.map