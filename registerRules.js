"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const available_1 = require("./Rules/TileImprovement/available");
const built_1 = require("./Rules/TileImprovement/built");
const created_1 = require("./Rules/Terrain/created");
const distribution_1 = require("./Rules/Terrain/distribution");
const distribution_groups_1 = require("./Rules/Terrain/distribution-groups");
const feature_1 = require("./Rules/Terrain/feature");
const pillaged_1 = require("./Rules/TileImprovement/pillaged");
const pick_start_tile_1 = require("./Rules/Player/pick-start-tile");
const start_1 = require("./Rules/Engine/start");
const yield_1 = require("./Rules/Tile/yield");
const yield_modifier_1 = require("./Rules/Tile/yield-modifier");
const pick_generator_1 = require("./Rules/WorldGenerator/pick-generator");
const civ1_game_1 = require("@civ-clone/civ1-game");
const register = (game) => game.rules.register(...(0, available_1.default)(game.playerResearch, game.tileImprovements), ...(0, built_1.default)(game.tileImprovements, game.engine), ...(0, created_1.default)(game.rules, game.availableTerrainFeatures), ...(0, distribution_1.default)(), ...(0, distribution_groups_1.default)(), ...(0, feature_1.default)(game.terrainFeatures), ...(0, pillaged_1.default)(game.tileImprovements, game.engine), ...(0, pick_start_tile_1.default)(game.earthStartTiles, game.engine, game.rng), ...(0, start_1.default)(game.rules, game.generators, game.engine), ...(0, yield_1.default)(game.tileImprovements, game.terrainFeatures, game.playerGovernments), ...(0, yield_modifier_1.default)(game.tileImprovements), ...(0, pick_generator_1.default)(game.generators, game.engine, game.rng));
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(civ1_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map