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
} from '../../Terrains';
import Effect from '@civ-clone/core-rule/Effect';
import DistributionGroups from '@civ-clone/core-world-generator/Rules/DistributionGroups';

export const getRules: () => DistributionGroups[] = (): DistributionGroups[] => [
  new DistributionGroups(
    // first pass (root terrain types)
    new Effect(() => [
      Ocean,
      Grassland,
      Swamp,
      Mountains,
      Jungle,
      Hills,
      Forest,
      Desert,
      Plains,
      Tundra,
      Arctic,
      River,
    ])
  ),
];

export default getRules;
