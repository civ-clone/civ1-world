import {
  Irrigation,
  Mine,
  Pollution,
  Railroad,
  Road,
} from './TileImprovements';
import { instance as availableTileImprovementRegistryInstance } from '@civ-clone/core-tile-improvement/AvailableTileImprovementRegistry';

availableTileImprovementRegistryInstance.register(
  Irrigation,
  Mine,
  Pollution,
  Railroad,
  Road
);
