import available from './Rules/TileImprovement/available';
import built from './Rules/TileImprovement/built';
import created from './Rules/Terrain/created';
import distribution from './Rules/Terrain/distribution';
import distributionGroups from './Rules/Terrain/distribution-groups';
import feature from './Rules/Terrain/feature';
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import pillaged from './Rules/TileImprovement/pillaged';
import start from './Rules/Engine/start';
import tileYield from './Rules/Tile/yield';
import tileYieldModifier from './Rules/Tile/yield-modifier';

ruleRegistryInstance.register(
  ...available(),
  ...built(),
  ...created(),
  ...distribution(),
  ...distributionGroups(),
  ...feature(),
  ...pillaged(),
  ...start(),
  ...tileYield(),
  ...tileYieldModifier()
);
