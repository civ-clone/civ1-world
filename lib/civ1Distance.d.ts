import Tile from '@civ-clone/core-world/Tile';
/**
 * The distance Civ1 uses for its rules (corruption, and later trade routes and the Diplomat's incite cost): the longer
 * axis plus half the shorter, rounded down, so a diagonal counts about 1.5. The x axis wraps and the y axis doesn't.
 *
 * `GetShortestDistance` in v474.05, and p. 224 of Wilson, J.L & Emrich A. (1992). Sid Meier's Civilization, or Rome
 * on 640K a Day. Rocklin, CA: Prima Publishing. `Tile#distanceFrom` stays the engine's general straight-line measure.
 */
export declare const civ1Distance: (from: Tile, to: Tile) => number;
export default civ1Distance;
