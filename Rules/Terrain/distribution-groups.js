"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Terrains_1 = require("../../Terrains");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const DistributionGroups_1 = require("@civ-clone/core-world-generator/Rules/DistributionGroups");
const getRules = () => [
    new DistributionGroups_1.default(
    // first pass (root terrain types)
    new Effect_1.default(() => [
        Terrains_1.Ocean,
        Terrains_1.Grassland,
        Terrains_1.Swamp,
        Terrains_1.Mountains,
        Terrains_1.Jungle,
        Terrains_1.Hills,
        Terrains_1.Forest,
        Terrains_1.Desert,
        Terrains_1.Plains,
        Terrains_1.Tundra,
        Terrains_1.Arctic,
        Terrains_1.River,
    ])),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=distribution-groups.js.map