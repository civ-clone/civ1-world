"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.civ1Distance = void 0;
/**
 * The distance Civ1 uses for its rules (corruption, and later trade routes and the Diplomat's incite cost): the longer
 * axis plus half the shorter, rounded down, so a diagonal counts about 1.5. The x axis wraps and the y axis doesn't.
 *
 * `GetShortestDistance` in v474.05, and p. 224 of Wilson, J.L & Emrich A. (1992). Sid Meier's Civilization, or Rome
 * on 640K a Day. Rocklin, CA: Prima Publishing. `Tile#distanceFrom` stays the engine's general straight-line measure.
 */
const civ1Distance = (from, to) => {
    const width = from.map().width(), directX = Math.abs(from.x() - to.x()), dx = Math.min(directX, width - directX), dy = Math.abs(from.y() - to.y());
    return Math.max(dx, dy) + Math.floor(Math.min(dx, dy) / 2);
};
exports.civ1Distance = civ1Distance;
exports.default = exports.civ1Distance;
//# sourceMappingURL=civ1Distance.js.map