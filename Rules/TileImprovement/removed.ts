import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';

export const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  engine?: Engine
) => Removed[] = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  engine: Engine = engineInstance
): Removed[] => [
  new Removed(
    'civ1-world:tile-improvement/removed/unregister',
    new Criterion((tile: Tile, tileImprovement: TileImprovement): boolean =>
      tileImprovementRegistry.getByTile(tile).includes(tileImprovement)
    ),
    new Effect((tile: Tile, tileImprovement: TileImprovement): void =>
      tileImprovementRegistry.unregister(tileImprovement)
    )
  ),
  new Removed(
    'civ1-world:tile-improvement/removed/clear-yield-cache',
    new Effect((tile: Tile): void => tile.clearYieldCache(null))
  ),
  new Removed(
    'civ1-world:tile-improvement/removed/emit',
    new Effect((tile: Tile, tileImprovement: TileImprovement): void => {
      engine.emit('tile-improvement:removed', tile, tileImprovement);
    })
  ),
];

export default getRules;
