import {
  AvailableTerrainFeatureRegistry,
  instance as availableTerrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/AvailableTerrainFeatureRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Created from '@civ-clone/core-terrain/Rules/Created';
import Effect from '@civ-clone/core-rule/Effect';
import Feature from '@civ-clone/core-terrain-feature/Rules/Feature';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TerrainFeature from '@civ-clone/core-terrain-feature/TerrainFeature';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  availableTerrainFeatureRegistry: AvailableTerrainFeatureRegistry = availableTerrainFeatureRegistryInstance
) => [
  new Created(
    new Effect((terrain: Terrain): void => {
      const rules = ruleRegistry.get(Feature);

      availableTerrainFeatureRegistry
        .entries()
        .forEach((TerrainFeatureType: typeof TerrainFeature): void =>
          rules
            .filter((rule: Feature): boolean =>
              rule.validate(TerrainFeatureType, terrain)
            )
            .forEach((rule: Feature): void =>
              rule.process(TerrainFeatureType, terrain)
            )
        );
    })
  ),
];

export default getRules;
