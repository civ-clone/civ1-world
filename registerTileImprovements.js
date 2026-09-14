"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TileImprovements_1 = require("./TileImprovements");
const AvailableTileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/AvailableTileImprovementRegistry");
AvailableTileImprovementRegistry_1.instance.register(TileImprovements_1.Irrigation, TileImprovements_1.Mine, TileImprovements_1.Pollution, TileImprovements_1.Railroad, TileImprovements_1.Road);
//# sourceMappingURL=registerTileImprovements.js.map