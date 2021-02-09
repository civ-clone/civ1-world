import { Food, Production, Trade } from './Yields';
import { instance as yieldRegistryInstance } from '@civ-clone/core-yield/YieldRegistry';

yieldRegistryInstance.register(Food, Production, Trade);
