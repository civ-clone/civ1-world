"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const EarthStartTileRegistry_1 = require("@civ-clone/civ1-earth-generator/EarthStartTileRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Yields_1 = require("../../Yields");
const Terrains_1 = require("../../Terrains");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PickStartTile_1 = require("@civ-clone/core-world-generator/Rules/PickStartTile");
const startTileCache = new Map(), tileScoreCache = new Map(), areaScoreCache = new Map(), tileScore = (tile, player = null) => {
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
            .filter((tile) => [Terrains_1.Grassland, Terrains_1.Plains, Terrains_1.River].some((TerrainType) => tile.terrain() instanceof TerrainType))
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
};
const getRules = (earthStartTileRegistry = EarthStartTileRegistry_1.instance, engine = Engine_1.instance, randomNumberGenerator = () => Math.random()) => [
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
        const startingSquares = pickStartTiles(world, engine);
        startingSquares.forEach((tile) => {
            if (usedStartSquares.some((startSquare) => startSquare.distanceFrom(tile) <= 4)) {
                startingSquares.splice(startingSquares.indexOf(tile), 1);
            }
        });
        return startingSquares[Math.floor(startingSquares.length * randomNumberGenerator())];
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pick-start-tile.js.map