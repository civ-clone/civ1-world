import { Food, Production, Trade } from '../../Yields';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { High, Low } from '@civ-clone/core-rule/Priorities';
import Player from '@civ-clone/core-player/Player';
import { Pollution, Railroad } from '../../TileImprovements';
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

  // Pollution halves a tile's food, shields and trade, rounded up, after everything else (v474.05 `CityWorker.cs`
  //  ~L4138, civ-clone/web-renderer#32).
  ...([Food, Production, Trade] as (typeof Yield)[]).map(
    (YieldType: typeof Yield): YieldModifier =>
      new YieldModifier(
        new Low(),
        new Criterion((tile: Tile): boolean =>
          tileImprovementRegistry
            .getByTile(tile)
            .some(
              (improvement: TileImprovement): boolean =>
                improvement instanceof Pollution
            )
        ),
        new Effect(
          (tile: Tile, player: Player | null, yields: Yield[]): void => {
            const currentTotal = yields
                .filter((tileYield) => tileYield instanceof YieldType)
                .reduce((total, tileYield) => total + tileYield.value(), 0),
              halved = Math.ceil(currentTotal / 2);

            if (halved === currentTotal) {
              return;
            }

            yields.push(new YieldType(halved - currentTotal, Pollution.name));
          }
        )
      )
  ),
];

export default getRules;
