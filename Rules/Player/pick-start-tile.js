"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Yields_1 = require("../../Yields");
const Terrains_1 = require("../../Terrains");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PickStartTile_1 = require("@civ-clone/core-world-generator/Rules/PickStartTile");
const Earth_1 = require("@civ-clone/civ1-earth-generator/Earth");
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
const getRules = (engine = Engine_1.instance, randomNumberGenerator = () => Math.random()) => [
    new PickStartTile_1.default(new Criterion_1.default(() => engine.option('earth', false)), new Effect_1.default((world, player) => (0, Earth_1.startSquare)(world, player.civilization()))),
    new PickStartTile_1.default(new Criterion_1.default(() => !engine.option('earth', false)), new Effect_1.default((world, player, usedStartSquares) => {
        const startingSquares = pickStartTiles(world);
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