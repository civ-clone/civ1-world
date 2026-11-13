"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.minimumBuildableTiles = void 0;
const EarthStartTileRegistry_1 = require("@civ-clone/civ1-earth-generator/EarthStartTileRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Yields_1 = require("../../Yields");
const Terrains_1 = require("../../Terrains");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PickStartTile_1 = require("@civ-clone/core-world-generator/Rules/PickStartTile");
const StartTilePicker_1 = require("@civ-clone/base-world-start/lib/StartTilePicker");
const civ1Distance_1 = require("../../lib/civ1Distance");
const core_random_1 = require("@civ-clone/core-random");
// v474.05 only starts a civilization on a continent with at least this many
// Grassland, Plains or River tiles.
exports.minimumBuildableTiles = 32;
// One picker for every world, so each is ranked once: on Grassland, Plains or River, by the food, production and trade
//  around it, at least 4 apart.
const picker = new StartTilePicker_1.default({
    TerrainTypes: [Terrains_1.Grassland, Terrains_1.Plains, Terrains_1.River],
    weights: [
        [Yields_1.Food, 8],
        [Yields_1.Production, 3],
        [Yields_1.Trade, 1],
    ],
    minimumRoom: exports.minimumBuildableTiles,
    tooClose: (startSquare, tile) => (0, civ1Distance_1.default)(startSquare, tile) <= 4,
});
const getRules = (earthStartTileRegistry = EarthStartTileRegistry_1.instance, engine = Engine_1.instance, randomNumberGenerator = core_random_1.instance) => [
    new PickStartTile_1.default(new Effect_1.default((world, player, usedStartSquares) => {
        if (engine.option('earth', false)) {
            try {
                return earthStartTileRegistry.getStartTileByCivilizationAndWorld(player.civilization().sourceClass(), world);
            }
            catch (e) {
                // TODO: The Civilization isn't registered, this might pose problems if the random selection are fixed start
                //  tiles, ideally we'd defer this selection until other `Player`s have picked.
                usedStartSquares.push(...earthStartTileRegistry
                    .entries()
                    .map((startTile) => startTile.startTileForMap(world)));
            }
        }
        return picker.pick(world, usedStartSquares, engine, randomNumberGenerator);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pick-start-tile.js.map