"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.civ1Distance = void 0;
/**
 * The longer axis plus half the shorter, rounded down. Both gaps are magnitudes.
 */
const longerPlusHalfShorter = (dx, dy) => Math.max(dx, dy) + Math.floor(Math.min(dx, dy) / 2);
/**
 * The distance Civ1 uses for its rules (corruption, trade routes, the Diplomat's costs, start-position spacing): the
 * longer axis plus half the shorter, rounded down, so a diagonal counts about 1.5. Both axes wrap, taking the short way
 * round as the world does. v474.05's map doesn't wrap top to bottom, so its y never wraps; here it does, or a city
 * across the seam from its capital would pay corruption as if a whole map away (civ-clone/web-renderer#437).
 *
 * The axes are the world's logical ones (`ITopology.logicalDelta`): `x` and `y` on the square grid, so the result
 * there is what it has always been, and the logical (`a`, `b`) on a staggered isometric grid, so a city's distance
 * from its capital means the same on either. A grid with no square axes (hexagonal), or a world from a copy of
 * core-world that predates `logicalDelta`, falls back to the storage `x` and `y`, as before.
 *
 * `GetShortestDistance` in v474.05, and p. 224 of Wilson, J.L & Emrich A. (1992). Sid Meier's Civilization, or Rome
 * on 640K a Day. Rocklin, CA: Prima Publishing. `Tile#distanceFrom` stays the engine's general straight-line measure.
 */
const civ1Distance = (from, to) => {
    const map = from.map(), topology = typeof map.topology === 'function' ? map.topology() : null, delta = topology && typeof topology.logicalDelta === 'function'
        ? topology.logicalDelta(from.x(), from.y(), to.x(), to.y())
        : null;
    if (delta) {
        return longerPlusHalfShorter(Math.abs(delta[0]), Math.abs(delta[1]));
    }
    const width = map.width(), height = map.height(), directX = Math.abs(from.x() - to.x()), directY = Math.abs(from.y() - to.y());
    return longerPlusHalfShorter(Math.min(directX, width - directX), Math.min(directY, height - directY));
};
exports.civ1Distance = civ1Distance;
exports.default = exports.civ1Distance;
//# sourceMappingURL=civ1Distance.js.map