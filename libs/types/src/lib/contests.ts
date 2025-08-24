import { NamedAPIResource, Name, Effect, FlavorText } from './common';

export interface ContestType {
  id: number;
  name: string;
  berry_flavor: NamedAPIResource; // BerryFlavor
  names: Name[];
}

export interface ContestEffect {
  id: number;
  appeal: number;
  jam: number;
  effect_entries: Effect[];
  flavor_text_entries: FlavorText[];
}

export interface SuperContestEffect {
  id: number;
  appeal: number;
  flavor_text_entries: FlavorText[];
  moves: NamedAPIResource[]; // Move
}
