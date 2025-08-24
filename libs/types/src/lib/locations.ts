import { NamedAPIResource, GenerationGameIndex, Name } from './common';

export interface Location {
  id: number;
  name: string;
  region: NamedAPIResource | null; // Region
  names: Name[];
  game_indices: GenerationGameIndex[];
  areas: NamedAPIResource[]; // LocationArea
}

export interface LocationArea {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: { encounter_method: NamedAPIResource; version_details: { rate: number; version: NamedAPIResource }[] }[];
  location: NamedAPIResource; // Location
  names: Name[];
  pokemon_encounters: { pokemon: NamedAPIResource; version_details: { version: NamedAPIResource; max_chance: number; encounter_details: any[] }[] }[];
}

export interface Region {
  id: number;
  name: string;
  locations: NamedAPIResource[];
  main_generation: NamedAPIResource | null; // Generation
  names: Name[];
  pokedexes: NamedAPIResource[];
  version_groups: NamedAPIResource[];
}
