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
        // The grid the world is laid out on: one of core-world's `topologyIds`.
        const topologyId = engine.option('topologyId', 'square');
        // Earth's maps are square data, one letter per square in rows, so they
        // cannot be laid out on another grid.
        if (engine.option('earth', false) && topologyId !== 'square') {
            throw new Error(`start: the 'earth' option is only available on the 'square' grid, but 'topologyId' is '${topologyId}'.`);
        }
        const [Generator] = ruleRegistry.process(PickGenerator_1.default), generator = new Generator(parseInt(engine.option('height', 100), 10), parseInt(engine.option('width', 160), 10), {
            landCoverage: parseFloat(engine.option('landCoverage', 0.4)),
            landSize: parseFloat(engine.option('landSize', 0.2)),
            maxIterations: parseInt(engine.option('maxIterations', 20), 10),
            topologyId,
        });
        // Check the grid against the size the generator really lays out (Earth
        // picks the nearest of its fixed maps) before anything is generated: an
        // unknown id, or an odd height on a grid that wraps north to south,
        // throws here rather than part way through building the world.
        generator.topology().validate(generator.width(), generator.height());
        const world = new World_1.default(generator, ruleRegistry);
        world.build();
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map