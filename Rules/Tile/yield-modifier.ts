import { Food, Production, Trade } from '../../Yields';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { High } from '@civ-clone/core-rule/Priorities';
import Player from '@civ-clone/core-player/Player';
import { Railroad } from '../../TileImprovements';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-world/Rules/YieldModifier';

export const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry
) => YieldModifier[] = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance
) => [
  ...(
    [
      [Food, 0.5],
      [Production, 0.5],
      [Trade, 0.5],
    ] as [typeof Yield, number][]
  ).map(
    ([YieldType, multiplier]): YieldModifier =>
      new YieldModifier(
        new High(),
        new Criterion((tile: Tile, player: Player | null, yields: Yield[]) =>
          yields.some((tileYield) => tileYield instanceof YieldType)
        ),
        new Criterion((tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Railroad
            )
        ),
        new Effect(
          (tile: Tile, player: Player | null, yields: Yield[]): void => {
            const currentTotal = yields
              .filter((tileYield) => tileYield instanceof YieldType)
              .reduce((total, tileYield) => total + tileYield.value(), 0);

            yields.push(
              new YieldType(
                Math.floor(currentTotal * multiplier),
                Railroad.name
              )
            );
          }
        )
      )
  ),
];

export default getRules;
