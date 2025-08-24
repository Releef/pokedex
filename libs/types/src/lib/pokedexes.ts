import { NamedAPIResource, Name } from './common';

export interface PokedexSummary {
  id: number;
  name: string;
  is_main_series: boolean;
  descriptions: { description: string; language: NamedAPIResource }[];
  names: Name[];
  pokemon_entries: { entry_number: number; pokemon_species: NamedAPIResource }[];
  region: NamedAPIResource | null;
  version_groups: NamedAPIResource[];
}
