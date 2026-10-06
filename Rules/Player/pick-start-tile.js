"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.minimumBuildableTiles = void 0;
const EarthStartTileRegistry_1 = require("@civ-clone/civ1-earth-generator/EarthStartTileRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Yields_1 = require("../../Yields");
const Terrains_1 = require("../../Terrains");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PickStartTile_1 = require("@civ-clone/core-world-generator/Rules/PickStartTile");
const civ1Distance_1 = require("../../lib/civ1Distance");
const core_random_1 = require("@civ-clone/core-random");
// v474.05 only starts a civilization on a continent with at least this many
// Grassland, Plains or River tiles.
exports.minimumBuildableTiles = 32;
const startTerrains = [Terrains_1.Grassland, Terrains_1.Plains, Terrains_1.River], isStartTerrain = (tile) => startTerrains.some((TerrainType) => tile.terrain() instanceof TerrainType), startTileCache = new Map(), buildableTilesCache = new Map(), tileScoreCache = new Map(), areaScoreCache = new Map(), tileScore = (tile, player = null) => {
    if (!tileScoreCache.has(tile)) {
        tileScoreCache.set(tile, tile.score(player, [
            [Yields_1.Food, 8],
            [Yields_1.Production, 3],
            [Yields_1.Trade, 1],
        ]));
    }
    return tileScoreCache.get(tile);
}, areaScore = (tile, player = null) => {
    if (!areaScoreCache.has(tile)) {
        areaScoreCache.set(tile, tile
            .getSurroundingArea()
            .entries()
            .reduce((total, tile) => total + tileScore(tile, player), 0));
    }
    return areaScoreCache.get(tile);
}, pickStartTiles = (world, engine = Engine_1.instance) => {
    if (!startTileCache.has(world)) {
        engine.emit('world:generate-start-tiles');
        const startingSquares = world
            .entries()
            .filter(isStartTerrain)
            .map((tile) => ({
            tile,
            score: areaScore(tile),
        }))
            .sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)
            .map(({ tile }) => tile);
        startTileCache.set(world, startingSquares);
        engine.emit('world:start-tiles', startingSquares);
    }
    return startTileCache.get(world);
}, 
// How many start-terrain tiles are on each tile's landmass.
buildableTiles = (world) => {
    if (!buildableTilesCache.has(world)) {
        const counts = new Map();
        world.landMasses().forEach((landMass) => {
            const tiles = landMass.tiles(), count = tiles.filter(isStartTerrain).length;
            tiles.forEach((tile) => counts.set(tile, count));
        });
        buildableTilesCache.set(world, counts);
    }
    return buildableTilesCache.get(world);
};
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
        const counts = buildableTiles(world), freeSquares = pickStartTiles(world, engine).filter((tile) => !usedStartSquares.some((startSquare) => (0, civ1Distance_1.default)(startSquare, tile) <= 4)), roomySquares = freeSquares.filter((tile) => { var _a; return ((_a = counts.get(tile)) !== null && _a !== void 0 ? _a : 0) >= exports.minimumBuildableTiles; }), 
        // With no room anywhere, start on whichever landmass has the most.
        most = freeSquares.reduce((most, tile) => { var _a; return Math.max(most, (_a = counts.get(tile)) !== null && _a !== void 0 ? _a : 0); }, 0), startingSquares = roomySquares.length > 0
            ? roomySquares
            : freeSquares.filter((tile) => { var _a; return ((_a = counts.get(tile)) !== null && _a !== void 0 ? _a : 0) === most; });
        return startingSquares[Math.floor(startingSquares.length * randomNumberGenerator())];
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pick-start-tile.js.map