import { NamedAPIResource } from './common';

export interface Pokemon {
  id: number;
  name: string;
  pokemontypes: PokemonType[];
  pokemonmoves: PokemonMove[];
  pokemonstats: PokemonStat[];
  pokemonsprites: { sprites: PokemonSprites }[];
}

// Minimal GraphQL subtypes used by our query
export interface PokemonType {
  type: { name: string };
}

export interface PokemonMove {
  move: { name: string };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: { name: string };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other: any;
  versions: any;
}

export interface TypeRelations {
  no_damage_to: NamedAPIResource[];
  half_damage_to: NamedAPIResource[];
  double_damage_to: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  double_damage_from: NamedAPIResource[];
}
