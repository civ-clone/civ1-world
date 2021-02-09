"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const AvailableTerrainFeatureRegistry_1 = require("@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Created_1 = require("@civ-clone/core-terrain/Rules/Created");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Feature_1 = require("@civ-clone/core-terrain-feature/Rules/Feature");
const getRules = (ruleRegistry = RuleRegistry_1.instance, availableTerrainFeatureRegistry = AvailableTerrainFeatureRegistry_1.instance) => [
    new Created_1.default(new Effect_1.default((terrain) => {
        const rules = ruleRegistry.get(Feature_1.Feature);
        availableTerrainFeatureRegistry
            .entries()
            .forEach((TerrainFeatureType) => rules
            .filter((rule) => rule.validate(TerrainFeatureType, terrain))
            .forEach((rule) => rule.process(TerrainFeatureType, terrain)));
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=created.js.map