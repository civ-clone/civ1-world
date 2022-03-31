"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const available_1 = require("./Rules/TileImprovement/available");
const built_1 = require("./Rules/TileImprovement/built");
const created_1 = require("./Rules/Terrain/created");
const distribution_1 = require("./Rules/Terrain/distribution");
const distribution_groups_1 = require("./Rules/Terrain/distribution-groups");
const feature_1 = require("./Rules/Terrain/feature");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const pillaged_1 = require("./Rules/TileImprovement/pillaged");
const start_1 = require("./Rules/Engine/start");
const yield_1 = require("./Rules/Tile/yield");
const yield_modifier_1 = require("./Rules/Tile/yield-modifier");
RuleRegistry_1.instance.register(...(0, available_1.default)(), ...(0, built_1.default)(), ...(0, created_1.default)(), ...(0, distribution_1.default)(), ...(0, distribution_groups_1.default)(), ...(0, feature_1.default)(), ...(0, pillaged_1.default)(), ...(0, start_1.default)(), ...(0, yield_1.default)(), ...(0, yield_modifier_1.default)());
//# sourceMappingURL=registerRules.js.map