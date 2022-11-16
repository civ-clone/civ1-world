import { Engine } from '@civ-clone/core-engine/Engine';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
export declare const getRules: (
  engine?: Engine,
  randomNumberGenerator?: () => number
) => PickStartTile[];
export default getRules;
