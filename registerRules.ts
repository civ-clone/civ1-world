import availableRequirements from './Requirements';
import { deriveAvailableRules } from './Rules/TileImprovement/available';
import built from './Rules/TileImprovement/built';
import created from './Rules/Terrain/created';
import distribution from './Rules/Terrain/distribution';
import distributionGroups from './Rules/Terrain/distribution-groups';
import feature from './Rules/Terrain/feature';
import pillaged from './Rules/TileImprovement/pillaged';
import removed from './Rules/TileImprovement/removed';
import playerPickStartTile from './Rules/Player/pick-start-tile';
import start from './Rules/Engine/start';
import tileYield from './Rules/Tile/yield';
import tileYieldModifier from './Rules/Tile/yield-modifier';
import worldGeneratorPickGenerator from './Rules/WorldGenerator/pick-generator';
import { Game, defaultGame } from '@civ-clone/civ1-game';

export const register = (game: Game): void => {
  // Where tile improvements can go, from the entries in `Requirements`: their rules come first, as they always did
  //  (civ-clone/web-renderer#37).
  game.requirements.add(
    deriveAvailableRules(game.playerResearch, game.tileImprovements),
    ...availableRequirements
  );

  game.rules.register(
    ...built(game.tileImprovements, game.engine),
    ...created(game.rules, game.availableTerrainFeatures),
    ...distribution(),
    ...distributionGroups(),
    ...feature(game.terrainFeatures),
    ...pillaged(game.tileImprovements, game.engine),
    ...removed(game.tileImprovements, game.engine),
    ...playerPickStartTile(game.earthStartTiles, game.engine, game.rng),
    ...start(game.rules, game.generators, game.engine),
    ...tileYield(game.tileImprovements, game.terrainFeatures),
    ...tileYieldModifier(game.tileImprovements, game.playerGovernments),
    ...worldGeneratorPickGenerator(game.generators, game.engine, game.rng)
  );
};

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
