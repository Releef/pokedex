import { NamedAPIResource, Name } from './common';

export interface Nature {
  id: number;
  name: string;
  decreased_stat: NamedAPIResource | null; // Stat
  increased_stat: NamedAPIResource | null; // Stat
  hates_flavor: NamedAPIResource | null; // BerryFlavor
  likes_flavor: NamedAPIResource | null; // BerryFlavor
  pokeathlon_stat_changes: { max_change: number; pokeathlon_stat: NamedAPIResource }[];
  move_battle_style_preferences: { low_hp_preference: number; high_hp_preference: number; move_battle_style: NamedAPIResource }[];
  names: Name[];
}
