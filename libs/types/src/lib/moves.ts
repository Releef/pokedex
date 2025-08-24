import { NamedAPIResource, MachineVersionDetail } from './common';

export interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number | null;
  priority: number;
  power: number | null;
  contest_combos?: any;
  contest_type?: NamedAPIResource | null;
  contest_effect?: NamedAPIResource | null; // APIResource to ContestEffect
  damage_class: NamedAPIResource; // MoveDamageClass
  effect_entries: { effect: string; short_effect: string; language: NamedAPIResource }[];
  effect_changes: { version_group: NamedAPIResource; effect_entries: { effect: string; language: NamedAPIResource }[] }[];
  learned_by_pokemon: NamedAPIResource[]; // Pokemon
  flavor_text_entries: { flavor_text: string; language: NamedAPIResource; version_group: NamedAPIResource }[];
  generation: NamedAPIResource;
  machines: MachineVersionDetail[];
  meta: MoveMetaData | null;
  names: { name: string; language: NamedAPIResource }[];
  past_values?: { accuracy?: number | null; effect_chance?: number | null; power?: number | null; pp?: number | null; effect_entries?: any[]; type?: NamedAPIResource; version_group: NamedAPIResource }[];
  stat_changes: { change: number; stat: NamedAPIResource }[];
  super_contest_effect?: NamedAPIResource | null; // APIResource
  target: NamedAPIResource; // MoveTarget
  type: NamedAPIResource; // Type
}

export interface MoveMetaData {
  ailment: NamedAPIResource; // MoveAilment
  category: NamedAPIResource; // MoveCategory
  min_hits: number | null;
  max_hits: number | null;
  min_turns: number | null;
  max_turns: number | null;
  drain: number;
  healing: number;
  crit_rate: number;
  ailment_chance: number;
  flinch_chance: number;
  stat_chance: number;
}
