"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableRequirements = void 0;
const Terrains_1 = require("./Terrains");
const Advances_1 = require("@civ-clone/library-science/Advances");
const TileImprovements_1 = require("./TileImprovements");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
// Where Civilization's tile improvements can be built, and what else they need, as the entries
//  `Rules/TileImprovement/available` makes its rules from (civ-clone/web-renderer#37). `registerRules` adds them to the
//  game's `requirements`. A tile improvement can be built by any one of its entries, so each is one way to build it:
//  a road on a River is a second way, needing Bridge Building.
const tileImprovement = (id, subject, targets, where) => new Requirement_1.Requirement({
    id: `civ1-world:tile-improvement/available/${id}`,
    subject,
    relation: 'requires',
    targets,
    range: 'tile',
    where,
});
/** The entries `Rules/TileImprovement/available`'s deriver makes rules from, in the order the rules were always registered. */
exports.availableRequirements = [
    tileImprovement('Irrigation', TileImprovements_1.Irrigation, [], [Terrains_1.Desert, Terrains_1.Grassland, Terrains_1.Hills, Terrains_1.Plains, Terrains_1.River]),
    tileImprovement('Mine', TileImprovements_1.Mine, [], [Terrains_1.Desert, Terrains_1.Hills, Terrains_1.Mountains]),
    tileImprovement('Road', TileImprovements_1.Road, [], [
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
    ]),
    tileImprovement('bridge/Road', TileImprovements_1.Road, [Advances_1.BridgeBuilding], [Terrains_1.River]),
    tileImprovement('Railroad', TileImprovements_1.Railroad, [Advances_1.Railroad, TileImprovements_1.Road], [
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
    ]),
];
exports.default = exports.availableRequirements;
//# sourceMappingURL=Requirements.js.map