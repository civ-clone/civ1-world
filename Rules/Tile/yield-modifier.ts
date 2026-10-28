import {
  DESPOTISM_PENALTY,
  TRADE_BONUS,
  despotismPenalty,
  governmentTileYieldTypes,
  tradeBonus,
} from '../../lib/governmentTileYield';
import { Food, Production, Trade } from '../../Yields';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { High, Low, Normal } from '@civ-clone/core-rule/Priorities';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import { Pollution, Railroad } from '../../TileImprovements';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-world/Rules/YieldModifier';

const playerGovernment = (
  player: Player | null,
  playerGovernmentRegistry: PlayerGovernmentRegistry
): PlayerGovernment | null => {
  if (player === null) {
    return null;
  }

  try {
    return playerGovernmentRegistry.getByPlayer(player);
  } catch (e) {
    // A player with no government yet, such as one being set up.
    if (
      e instanceof TypeError &&
      e.message.match(/Wrong number of PlayerGovernments/)
    ) {
      return null;
    }

    throw e;
  }
};

export const getRules: (
  tileImprovementRegistry?: TileImprovementRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => YieldModifier[] = (
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance
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

  // Anarchy and Despotism take 1 off a yield of more than 2, then The Republic and Democracy add 1 to any trade, after
  //  the railroad and before pollution (v474.05 `CityWorker.cs` L4102-4134, civ-clone/web-renderer#401). This is for
  //  a city that isn't celebrating; civ1-city-happiness adds the difference for one that is. The two are added as
  //  separate yields, so the city can find what the tile yielded before them.
  ...(
    [
      [
        DESPOTISM_PENALTY,
        (YieldType, value, government) => despotismPenalty(value, government),
      ],
      [TRADE_BONUS, tradeBonus],
    ] as [
      string,
      (
        YieldType: typeof Yield,
        value: number,
        government: PlayerGovernment | null
      ) => number
    ][]
  ).flatMap(([provider, step]): YieldModifier[] =>
    governmentTileYieldTypes.map(
      (YieldType: typeof Yield): YieldModifier =>
        new YieldModifier(
          new Normal(),
          new Effect(
            (tile: Tile, player: Player | null, yields: Yield[]): void => {
              const currentTotal = yields
                  .filter((tileYield) => tileYield instanceof YieldType)
                  .reduce((total, tileYield) => total + tileYield.value(), 0),
                adjusted = step(
                  YieldType,
                  currentTotal,
                  playerGovernment(player, playerGovernmentRegistry)
                );

              if (adjusted === currentTotal) {
                return;
              }

              yields.push(new YieldType(adjusted - currentTotal, provider));
            }
          )
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
