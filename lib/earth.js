"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEarth = void 0;
const Earth_1 = require("@civ-clone/civ1-earth-generator/Earth");
/**
 * Whether `world` is the Earth: made by civ1-earth-generator's `Earth`, as the world records (`generatorId()`) and
 *  keeps in a save. The engine's `earth` option is what chooses that generator, before there is a world, and isn't
 *  saved, so a rule that reads it after a load is told "no" (civ-clone/web-renderer#175).
 */
const isEarth = (world) => 
// A square of no world (as a rule's own test makes) isn't the Earth's.
world !== null && world.generatorId() === Earth_1.earthGeneratorId;
exports.isEarth = isEarth;
exports.default = exports.isEarth;
//# sourceMappingURL=earth.js.map