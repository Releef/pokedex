import { NamedAPIResource } from './common';

export interface EvolutionChain {
  id: number;
  baby_trigger_item: NamedAPIResource | null; // Item
  chain: ChainLink;
}

export interface ChainLink {
  is_baby: boolean;
  species: NamedAPIResource; // PokemonSpecies
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionDetail {
  item: NamedAPIResource | null; // Item
  trigger: NamedAPIResource; // EvolutionTrigger
  gender: number | null;
  held_item: NamedAPIResource | null; // Item
  known_move: NamedAPIResource | null; // Move
  known_move_type: NamedAPIResource | null; // Type
  location: NamedAPIResource | null; // Location
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean | null;
  party_species: NamedAPIResource | null; // PokemonSpecies
  party_type: NamedAPIResource | null; // Type
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: NamedAPIResource | null; // PokemonSpecies
  turn_upside_down: boolean | null;
}
