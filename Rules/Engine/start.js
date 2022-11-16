"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const GeneratorRegistry_1 = require("@civ-clone/core-world-generator/GeneratorRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PickGenerator_1 = require("@civ-clone/core-world-generator/Rules/PickGenerator");
const Start_1 = require("@civ-clone/core-engine/Rules/Start");
const World_1 = require("@civ-clone/core-world/World");
const getRules = (ruleRegistry = RuleRegistry_1.instance, generatorRegistry = GeneratorRegistry_1.instance, engine = Engine_1.instance) => [
    new Start_1.default(new Effect_1.default(() => {
        const [Generator] = ruleRegistry.process(PickGenerator_1.default), generator = new Generator(parseInt(engine.option('height', 100), 10), parseInt(engine.option('width', 160), 10), {
            landCoverage: parseFloat(engine.option('landCoverage', 0.4)),
            landSize: parseFloat(engine.option('landSize', 0.2)),
            maxIterations: parseInt(engine.option('maxIterations', 20), 10),
        }), world = new World_1.default(generator, ruleRegistry);
        world.build();
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map