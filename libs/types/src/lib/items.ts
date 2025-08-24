import { NamedAPIResource, FlavorText, MachineVersionDetail } from './common';

export interface Item {
  id: number;
  name: string;
  cost: number;
  fling_power: number | null;
  fling_effect: NamedAPIResource | null; // ItemFlingEffect
  attributes: NamedAPIResource[]; // ItemAttribute
  category: NamedAPIResource; // ItemCategory
  effect_entries: { effect: string; short_effect: string; language: NamedAPIResource }[];
  flavor_text_entries: FlavorText[];
  game_indices: { game_index: number; generation: NamedAPIResource }[];
  names: { name: string; language: NamedAPIResource }[];
  sprites: { default: string | null };
  held_by_pokemon: { pokemon: NamedAPIResource; version_details: { rarity: number; version: NamedAPIResource }[] }[];
  baby_trigger_for?: { url: string } | null; // APIResource to EvolutionChain
  machines: MachineVersionDetail[];
}

export interface ItemAttribute {
  id: number;
  name: string;
  items: NamedAPIResource[];
  names: { name: string; language: NamedAPIResource }[];
  descriptions: { description: string; language: NamedAPIResource }[];
}

export interface ItemCategory {
  id: number;
  name: string;
  items: NamedAPIResource[];
  names: { name: string; language: NamedAPIResource }[];
  pocket: NamedAPIResource; // ItemPocket
}

export interface ItemPocket {
  id: number;
  name: string;
  categories: NamedAPIResource[]; // ItemCategory
}
