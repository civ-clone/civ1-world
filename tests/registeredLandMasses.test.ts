import { Grassland, Ocean } from '../Terrains';
import Built from '@civ-clone/core-world/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/civ1-game';
import Generator from '@civ-clone/core-world-generator/Generator';
import Start from '@civ-clone/core-engine/Rules/Start';
import Terrain from '@civ-clone/core-terrain/Terrain';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import { instance as landMassRegistryInstance } from '@civ-clone/core-world/LandMassRegistry';
import { register } from '../registerRules';

// One continent: a column of Grassland down the middle of the Ocean.
class IslandGenerator extends Generator {
  async generate(): Promise<Terrain[]> {
    return Array.from(
      { length: this.height() * this.width() },
      (_: unknown, i: number): Terrain =>
        i % this.width() === 3 ? new Grassland() : new Ocean()
    );
  }
}

// A game built with its own registries finds its world's continents in `game.landMasses`, where everything that asks
//  about them looks, not in core-world's instance (civ-clone/web-renderer#301).
describe('a registered game: land masses', (): void => {
  it("puts the world's continents in the game's own land-mass registry", async (): Promise<void> => {
    const game = new Game(),
      defaultLandMasses = landMassRegistryInstance.length;
    let resolveBuilt: (world: World) => void = () => {};

    register(game);

    game.generators.register(IslandGenerator);
    game.engine.setOption('topologyId', 'square');
    game.engine.setOption('height', 6);
    game.engine.setOption('width', 8);
    game.rules.register(
      new Built(new Effect((world: World): void => resolveBuilt(world)))
    );

    const built = new Promise<World>((resolve) => (resolveBuilt = resolve));

    game.rules.process(Start);

    await built;

    expect(game.landMasses.entries()).to.have.length(1);
    expect(game.landMasses.entries()[0].tiles()).to.have.length(6);
    expect(landMassRegistryInstance.length).to.equal(defaultLandMasses);
  });
});
