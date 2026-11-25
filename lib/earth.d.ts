import { IWorld } from '@civ-clone/core-world/World';
/**
 * Whether `world` is the Earth: made by civ1-earth-generator's `Earth`, as the world records (`generatorId()`) and
 *  keeps in a save. The engine's `earth` option is what chooses that generator, before there is a world, and isn't
 *  saved, so a rule that reads it after a load is told "no" (civ-clone/web-renderer#175).
 */
export declare const isEarth: (world: IWorld) => boolean;
export default isEarth;
