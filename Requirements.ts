import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Plains,
  River,
  Swamp,
  Tundra,
} from './Terrains';
import {
  BridgeBuilding,
  Railroad as RailroadAdvance,
} from '@civ-clone/library-science/Advances';
import { Irrigation, Mine, Railroad, Road } from './TileImprovements';
import { Requirement, Target } from '@civ-clone/core-requirement/Requirement';
import Terrain from '@civ-clone/core-terrain/Terrain';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';

// Where Civilization's tile improvements can be built, and what else they need, as the entries
//  `Rules/TileImprovement/available` makes its rules from (civ-clone/web-renderer#37). `registerRules` adds them to the
//  game's `requirements`. A tile improvement can be built by any one of its entries, so each is one way to build it:
//  a road on a River is a second way, needing Bridge Building.

const tileImprovement = (
  id: string,
  subject: typeof TileImprovement,
  targets: Target[],
  where: (typeof Terrain)[]
): Requirement =>
  new Requirement({
    id: `civ1-world:tile-improvement/available/${id}`,
    subject,
    relation: 'requires',
    targets,
    range: 'tile',
    where,
  });

/** The entries `Rules/TileImprovement/available`'s deriver makes rules from, in the order the rules were always registered. */
export const availableRequirements: Requirement[] = [
  tileImprovement(
    'Irrigation',
    Irrigation,
    [],
    [Desert, Grassland, Hills, Plains, River]
  ),
  tileImprovement('Mine', Mine, [], [Desert, Hills, Mountains]),
  tileImprovement(
    'Road',
    Road,
    [],
    [
      Arctic,
      Desert,
      Forest,
      Grassland,
      Hills,
      Jungle,
      Mountains,
      Plains,
      Swamp,
      Tundra,
    ]
  ),
  tileImprovement('bridge/Road', Road, [BridgeBuilding], [River]),
  tileImprovement(
    'Railroad',
    Railroad,
    [RailroadAdvance, Road],
    [
      Arctic,
      Desert,
      Forest,
      Grassland,
      Hills,
      Jungle,
      Mountains,
      Plains,
      River,
      Swamp,
      Tundra,
    ]
  ),
];

export default availableRequirements;
