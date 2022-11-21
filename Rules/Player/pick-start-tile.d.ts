import { EarthStartTileRegistry } from '@civ-clone/civ1-earth-generator/EarthStartTileRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
export declare const getRules: (
  earthStartTileRegistry?: EarthStartTileRegistry,
  engine?: Engine,
  randomNumberGenerator?: () => number
) => PickStartTile[];
export default getRules;
