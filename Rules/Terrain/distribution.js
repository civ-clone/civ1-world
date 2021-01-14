"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Terrains_1 = require("../../Terrains");
const Distribution_1 = require("@civ-clone/core-terrain/Rules/Distribution");
const Types_1 = require("@civ-clone/core-terrain/Types");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = () => [
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Arctic), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.0,
            to: 0.02,
            coverage: 1,
            cluster: true,
        },
        {
            from: 0.02,
            to: 0.1,
        },
        {
            from: 0.9,
            to: 0.98,
        },
        {
            from: 0.98,
            to: 1,
            coverage: 1,
            cluster: true,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Desert), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.4,
            to: 0.45,
        },
        {
            from: 0.45,
            to: 0.55,
            coverage: 0.25,
            cluster: true,
            clusterChance: 0.6,
        },
        {
            from: 0.55,
            to: 0.6,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Forest), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.05,
            to: 0.2,
        },
        {
            from: 0.2,
            to: 0.4,
            cluster: true,
            clusterChance: 0.4,
            coverage: 0.4,
        },
        {
            from: 0.4,
            to: 0.6,
        },
        {
            from: 0.6,
            to: 0.8,
            cluster: true,
            clusterChance: 0.4,
            coverage: 0.4,
        },
        {
            from: 0.8,
            to: 0.95,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Grassland), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            fill: true,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Hills), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.1,
            to: 0.9,
            path: true,
            pathChance: 0.5,
            coverage: 0.2,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Jungle), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.3,
            to: 0.45,
            cluster: true,
            clusterChance: 0.2,
            coverage: 0.4,
        },
        {
            from: 0.55,
            to: 0.7,
            cluster: true,
            clusterChance: 0.2,
            coverage: 0.4,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Mountains), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.1,
            to: 0.9,
            cluster: true,
            path: true,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Ocean), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain.constructor === Types_1.Water)), new Effect_1.default(() => [
        {
            fill: true,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Plains), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.1,
            to: 0.2,
        },
        {
            from: 0.2,
            to: 0.4,
        },
        {
            from: 0.1,
            to: 0.4,
            path: true,
        },
        {
            from: 0.4,
            to: 0.6,
        },
        {
            from: 0.6,
            to: 0.8,
        },
        {
            from: 0.6,
            to: 0.9,
            path: true,
        },
        {
            from: 0.8,
            to: 0.9,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.River), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.1,
            to: 0.9,
            coverage: 0.2,
            path: true,
            pathChance: 0.75,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Swamp), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.2,
            to: 0.4,
            cluster: true,
        },
        {
            from: 0.6,
            to: 0.8,
            cluster: true,
        },
    ])),
    new Distribution_1.Distribution(new Criterion_1.default((TerrainType) => TerrainType === Terrains_1.Tundra), new Criterion_1.default((TerrainType, mapData) => mapData.some((terrain) => terrain instanceof Types_1.Land)), new Effect_1.default(() => [
        {
            from: 0.02,
            to: 0.15,
            cluster: true,
        },
        {
            from: 0.85,
            to: 0.98,
            cluster: true,
        },
    ])),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=distribution.js.map