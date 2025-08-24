import { NamedAPIResource, Name } from './common';

export interface Stat {
  id: number;
  name: string;
  game_index: number;
  is_battle_only: boolean;
  affecting_moves: {
    increase: { change: number; move: NamedAPIResource }[];
    decrease: { change: number; move: NamedAPIResource }[];
  };
  affecting_natures: {
    increase: NamedAPIResource[];
    decrease: NamedAPIResource[];
  };
  characteristics: { url: string }[];
  move_damage_class: NamedAPIResource | null;
  names: Name[];
}
