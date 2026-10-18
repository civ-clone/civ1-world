"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.civ1Distance = void 0;
/**
 * The distance Civ1 uses for its rules (corruption, trade routes, the Diplomat's costs, start-position spacing): the
 * longer axis plus half the shorter, rounded down, so a diagonal counts about 1.5. Both axes wrap, taking the short way
 * round as the world does. v474.05's map doesn't wrap top to bottom, so its y never wraps; here it does, or a city
 * across the seam from its capital would pay corruption as if a whole map away (civ-clone/web-renderer#437).
 *
 * `GetShortestDistance` in v474.05, and p. 224 of Wilson, J.L & Emrich A. (1992). Sid Meier's Civilization, or Rome
 * on 640K a Day. Rocklin, CA: Prima Publishing. `Tile#distanceFrom` stays the engine's general straight-line measure.
 */
const civ1Distance = (from, to) => {
    const width = from.map().width(), height = from.map().height(), directX = Math.abs(from.x() - to.x()), directY = Math.abs(from.y() - to.y()), dx = Math.min(directX, width - directX), dy = Math.min(directY, height - directY);
    return Math.max(dx, dy) + Math.floor(Math.min(dx, dy) / 2);
};
exports.civ1Distance = civ1Distance;
exports.default = exports.civ1Distance;
//# sourceMappingURL=civ1Distance.js.map