"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const available_1 = require("./Rules/TileImprovement/available");
const built_1 = require("./Rules/TileImprovement/built");
const created_1 = require("./Rules/Terrain/created");
const distribution_1 = require("./Rules/Terrain/distribution");
const distributionGroups_1 = require("./Rules/Terrain/distributionGroups");
const feature_1 = require("./Rules/Terrain/feature");
const pillaged_1 = require("./Rules/TileImprovement/pillaged");
const start_1 = require("./Rules/Engine/start");
const yield_1 = require("./Rules/Tile/yield");
RuleRegistry_1.instance.register(...available_1.default(), ...built_1.default(), ...created_1.default(), ...distribution_1.default(), ...distributionGroups_1.default(), ...feature_1.default(), ...pillaged_1.default(), ...start_1.default(), ...yield_1.default());
//# sourceMappingURL=registerRules.js.map