import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../Terrains';
import { Food, Production, Trade } from '../Yields';
import { Irrigation, Mine, Railroad, Road } from '../TileImprovements';
import tileYieldModifier, {
  RAILROAD_BONUS,
} from '../Rules/Tile/yield-modifier';
import { EffectDescription } from '@civ-clone/core-rule/Description';
import { Land } from '@civ-clone/core-terrain/Types';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import { expect } from 'chai';
import tileYield from '../Rules/Tile/yield';

// What each terrain says it gives, for the Civilopedia (civ-clone/web-renderer#620), checked against what the rules
//  give: the yield rules are run on a square of each terrain, with no special resource, with and without each
//  improvement. Improvements are made with `Object.create`, so making one doesn't run the game's `Built` rules.
describe('descriptions', (): void => {
  const terrains: (typeof Terrain)[] = [
      Arctic,
      Desert,
      Forest,
      Grassland,
      Hills,
      Jungle,
      Mountains,
      Ocean,
      Plains,
      River,
      Swamp,
      Tundra,
    ],
    yieldTypes: (typeof Yield)[] = [Food, Production, Trade],
    // A square of `TerrainType` holding `improvements`, and the yield rules, with registries that know only those.
    yields = (
      TerrainType: typeof Terrain,
      ...improvements: TileImprovement[]
    ): Map<typeof Yield, number> => {
      const terrain = new TerrainType(),
        tile = { terrain: (): Terrain => terrain } as unknown as Tile,
        rules = tileYield(
          {
            getByTile: (): TileImprovement[] => improvements,
          } as unknown as TileImprovementRegistry,
          {
            getByTerrain: () => [],
          } as unknown as TerrainFeatureRegistry
        ),
        totals = new Map<typeof Yield, number>(
          yieldTypes.map((YieldType) => [YieldType, 0])
        );

      rules
        .filter((rule) => rule.validate(tile, null))
        .flatMap((rule) => rule.process(tile, null))
        .forEach((tileYield: Yield): void =>
          yieldTypes
            .filter((YieldType) => tileYield instanceof YieldType)
            .forEach((YieldType) =>
              totals.set(
                YieldType,
                (totals.get(YieldType) as number) + tileYield.value()
              )
            )
        );

      return totals;
    },
    described = tileYield().flatMap((rule) => rule.descriptions()),
    describedFor = (
      type: string,
      TerrainType: typeof Terrain
    ): EffectDescription[] =>
      described.filter(
        (description: EffectDescription): boolean =>
          description.type === type && description.subject === TerrainType
      );

  terrains.forEach((TerrainType: typeof Terrain): void => {
    it(`${TerrainType.name} says what it gives, and nothing it doesn't`, (): void => {
      const given = yields(TerrainType);

      expect(
        describedFor('terrain_yield', TerrainType),
        TerrainType.name
      ).to.have.deep.members(
        yieldTypes
          .filter((YieldType) => given.get(YieldType) !== 0)
          .map((YieldType) => ({
            type: 'terrain_yield',
            subject: TerrainType,
            yield: YieldType,
            value: given.get(YieldType),
          }))
      );
    });

    it(`${TerrainType.name} says what irrigation, a mine and a road add to it`, (): void => {
      const base = yields(TerrainType);

      expect(
        describedFor('improvement_yield', TerrainType),
        TerrainType.name
      ).to.have.deep.members(
        ([Irrigation, Mine, Road] as (typeof TileImprovement)[]).flatMap(
          (Improvement: typeof TileImprovement) => {
            const improved = yields(
              TerrainType,
              Object.create(Improvement.prototype)
            );

            return yieldTypes
              .filter(
                (YieldType) => improved.get(YieldType) !== base.get(YieldType)
              )
              .map((YieldType) => ({
                type: 'improvement_yield',
                subject: TerrainType,
                yield: YieldType,
                value:
                  (improved.get(YieldType) as number) -
                  (base.get(YieldType) as number),
                improvement: Improvement,
              }));
          }
        )
      );
    });
  });

  it('Arctic says it gives nothing', (): void => {
    expect(describedFor('terrain_yield', Arctic)).to.eql([]);
  });

  it('a Railroad adds half of each yield on any land square', (): void => {
    const tile = {} as unknown as Tile,
      rules = tileYieldModifier({
        getByTile: (): TileImprovement[] => [Object.create(Railroad.prototype)],
      } as unknown as TileImprovementRegistry);

    expect(rules.flatMap((rule) => rule.descriptions())).to.eql(
      yieldTypes.map((YieldType) => ({
        type: 'improvement_yield_percent',
        subject: Land,
        yield: YieldType,
        value: RAILROAD_BONUS,
        improvement: Railroad,
      }))
    );

    // Every terrain a Railroad can be built on is land, and Ocean isn't.
    terrains.forEach((TerrainType: typeof Terrain): void =>
      expect(new TerrainType() instanceof Land, TerrainType.name).to.equal(
        TerrainType !== Ocean
      )
    );

    // Run each: 4 of a yield on a square with a Railroad gets the described share of it more.
    rules
      .filter((rule) => rule.descriptions().length > 0)
      .forEach((rule): void => {
        const [description] = rule.descriptions(),
          YieldType = description.yield as typeof Yield,
          current: Yield[] = [new YieldType(4)];

        expect(rule.validate(tile, null, current)).to.equal(true);

        rule.process(tile, null, current);

        expect(
          current.slice(1).map((added: Yield): number => added.value())
        ).to.eql([4 * (description.value as number)]);
      });
  });
});
