"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const GeneratorRegistry_1 = require("@civ-clone/core-world-generator/GeneratorRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Start_1 = require("@civ-clone/core-engine/Rules/Start");
const startWorld_1 = require("@civ-clone/base-world-start/lib/startWorld");
const getRules = (ruleRegistry = RuleRegistry_1.instance, generatorRegistry = GeneratorRegistry_1.instance, engine = Engine_1.instance) => [
    new Start_1.default(new Effect_1.default(() => {
        (0, startWorld_1.default)(ruleRegistry, engine, {
            // The grid the world is laid out on, unless the `topologyId` option names one of core-world's `topologyIds`.
            defaults: {
                topologyId: 'square',
                height: 100,
                width: 160,
                landCoverage: 0.4,
                landSize: 0.2,
                maxIterations: 20,
            },
            check: (topologyId) => {
                // Earth's maps are square data, one letter per square in rows, so they
                // cannot be laid out on another grid.
                if (engine.option('earth', false) && topologyId !== 'square') {
                    throw new Error(`start: the 'earth' option is only available on the 'square' grid, but 'topologyId' is '${topologyId}'.`);
                }
            },
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map