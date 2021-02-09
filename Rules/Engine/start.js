"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Built_1 = require("@civ-clone/core-world/Rules/Built");
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
            landCoverage: parseFloat(Engine_1.instance.option('landCoverage', 0.2 + Math.random() * 0.2)),
            landMassReductionScale: parseFloat(Engine_1.instance.option('landMassReductionScale', Math.random() * 5)),
            // chanceToBecomeLand: parseInt(engine.option('chanceToBecomeLand', Math.random() / 15), 10),
            // smoothness
            maxIterations: parseInt(Engine_1.instance.option('maxIterations', 5), 10),
        }), world = new World_1.default(generator);
        world.build();
        ruleRegistry.process(Built_1.Built, world);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map