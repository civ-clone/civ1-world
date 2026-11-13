"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const GeneratorRegistry_1 = require("@civ-clone/core-world-generator/GeneratorRegistry");
const Earth_1 = require("@civ-clone/civ1-earth-generator/Earth");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PickGenerator_1 = require("@civ-clone/core-world-generator/Rules/PickGenerator");
const pickGenerator_1 = require("@civ-clone/base-world-start/lib/pickGenerator");
const core_random_1 = require("@civ-clone/core-random");
const getRules = (generatorRegistry = GeneratorRegistry_1.instance, engine = Engine_1.instance, randomNumberGenerator = core_random_1.instance) => [
    new PickGenerator_1.default(new Effect_1.default(() => {
        if (engine.option('earth', false)) {
            return Earth_1.default;
        }
        return (0, pickGenerator_1.default)(generatorRegistry, randomNumberGenerator);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pick-generator.js.map