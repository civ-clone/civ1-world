"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const GeneratorRegistry_1 = require("@civ-clone/core-world-generator/GeneratorRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Start_1 = require("@civ-clone/core-engine/Rules/Start");
const World_1 = require("@civ-clone/core-world/World");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const getRules = (ruleRegistry = RuleRegistry_1.instance, generatorRegistry = GeneratorRegistry_1.instance) => [
    new Start_1.default(new Effect_1.default(() => {
        // TODO: Registry.getRandom()
        const availableGenerators = generatorRegistry.entries(), RandomGenerator = availableGenerators[Math.floor(availableGenerators.length * Math.random())], generator = new RandomGenerator(parseInt(Engine_1.instance.option('height', 100), 10), parseInt(Engine_1.instance.option('width', 160), 10), {
            landCoverage: parseFloat(Engine_1.instance.option('landCoverage', 0.4)),
            landSize: parseFloat(Engine_1.instance.option('landSize', 0.2)),
            maxIterations: parseInt(Engine_1.instance.option('maxIterations', 20), 10),
        }), world = new World_1.default(generator);
        world.build();
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map