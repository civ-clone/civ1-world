import available from './Rules/TileImprovement/available';
import built from './Rules/TileImprovement/built';
import created from './Rules/Terrain/created';
import distribution from './Rules/Terrain/distribution';
import distributionGroups from './Rules/Terrain/distribution-groups';
import feature from './Rules/Terrain/feature';
import pillaged from './Rules/TileImprovement/pillaged';
import playerPickStartTile from './Rules/Player/pick-start-tile';
import start from './Rules/Engine/start';
import tileYield from './Rules/Tile/yield';
import tileYieldModifier from './Rules/Tile/yield-modifier';
import worldGeneratorPickGenerator from './Rules/WorldGenerator/pick-generator';
import { Game, defaultGame } from '@civ-clone/civ1-game';

export const register = (game: Game): void =>
  game.rules.register(
    ...available(game.playerResearch, game.tileImprovements),
    ...built(game.tileImprovements, game.engine),
    ...created(game.rules, game.availableTerrainFeatures),
    ...distribution(),
    ...distributionGroups(),
    ...feature(game.terrainFeatures),
    ...pillaged(game.tileImprovements, game.engine),
    ...playerPickStartTile(game.earthStartTiles, game.engine, game.rng),
    ...start(game.rules, game.generators, game.engine),
    ...tileYield(
      game.tileImprovements,
      game.terrainFeatures,
      game.playerGovernments
    ),
    ...tileYieldModifier(game.tileImprovements),
    ...worldGeneratorPickGenerator(game.generators, game.engine, game.rng)
  );

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
