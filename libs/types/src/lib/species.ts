import { NamedAPIResource, Name, FlavorText } from './common';

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: NamedAPIResource; // GrowthRate
  pokedex_numbers: { entry_number: number; pokedex: NamedAPIResource }[];
  egg_groups: NamedAPIResource[];
  color: NamedAPIResource; // PokemonColor
  shape: NamedAPIResource | null; // PokemonShape
  evolves_from_species: NamedAPIResource | null;
  evolution_chain: { url: string } | null; // APIResource
  habitat: NamedAPIResource | null; // PokemonHabitat
  generation: NamedAPIResource; // Generation
  names: Name[];
  pal_park_encounters: { base_score: number; rate: number; area: NamedAPIResource }[];
  flavor_text_entries: FlavorText[];
  form_descriptions: { description: string; language: NamedAPIResource }[];
  genera: { genus: string; language: NamedAPIResource }[];
  varieties: { is_default: boolean; pokemon: NamedAPIResource }[];
}
