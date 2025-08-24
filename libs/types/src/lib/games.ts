import { NamedAPIResource, Name } from './common';

export interface Generation {
  id: number;
  name: string;
  abilities: NamedAPIResource[];
  names: Name[];
  main_region: NamedAPIResource; // Region
  moves: NamedAPIResource[];
  pokemon_species: NamedAPIResource[];
  types: NamedAPIResource[];
  version_groups: NamedAPIResource[];
}

export interface Pokedex {
  id: number;
  name: string;
  is_main_series: boolean;
  descriptions: { description: string; language: NamedAPIResource }[];
  names: Name[];
  pokemon_entries: { entry_number: number; pokemon_species: NamedAPIResource }[];
  region: NamedAPIResource | null;
  version_groups: NamedAPIResource[];
}

export interface Version {
  id: number;
  name: string;
  names: Name[];
  version_group: NamedAPIResource;
}

export interface VersionGroup {
  id: number;
  name: string;
  order: number;
  generation: NamedAPIResource; // Generation
  move_learn_methods: NamedAPIResource[];
  pokedexes: NamedAPIResource[];
  regions: NamedAPIResource[];
  versions: NamedAPIResource[];
}
