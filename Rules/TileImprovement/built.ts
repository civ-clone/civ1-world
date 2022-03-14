import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import { Irrigation, Mine } from '../../TileImprovements';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';

export const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  engine?: Engine
) => Built[] = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  engine: Engine = engineInstance
): Built[] => [
  new Built(
    new Criterion((tile: Tile, tileImprovement: TileImprovement): boolean =>
      tileImprovementRegistry
        .getByTile(tile)
        .every(
          (existingTileImprovement: TileImprovement) =>
            tileImprovement.constructor !== existingTileImprovement.constructor
        )
    ),
    new Effect((tile: Tile, tileImprovement: TileImprovement): void =>
      tileImprovementRegistry.register(tileImprovement)
    )
  ),
  new Built(new Effect((tile: Tile): void => tile.clearYieldCache(null))),
  new Built(
    new Effect((tile: Tile, tileImprovement: TileImprovement): void => {
      engine.emit('tile-improvement:built', tile, tileImprovement);
    })
  ),
  ...(
    [
      [Mine, Irrigation],
      [Irrigation, Mine],
    ] as [typeof TileImprovement, typeof TileImprovement][]
  ).map(
    ([Improvement, ToRemove]) =>
      new Built(
        new Criterion(
          (tile: Tile, tileImprovement: TileImprovement) =>
            tileImprovement instanceof Improvement
        ),
        new Criterion((tile: Tile) =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (tileImprovement: TileImprovement) =>
                tileImprovement instanceof ToRemove
            )
        ),
        new Effect((tile: Tile) =>
          tileImprovementRegistry.unregister(
            ...tileImprovementRegistry
              .getByTile(tile)
              .filter(
                (tileImprovement: TileImprovement) =>
                  tileImprovement instanceof ToRemove
              )
          )
        )
      )
  ),
];

export default getRules;
