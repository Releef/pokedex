/**
 * Interface for the 'PokedexState' data
 */
export interface PokedexStateEntity {
  id: string | number; // Primary ID
  name: string;
}

export type Pokemon = {
  abilities: Ability[],
  base_experience: number,
  cries: {[key: string]: string},
  forms: Form[],
  game_indices: GameIndex[],
  height: number,
  held_items: HeldItem[],
  id: number,
  is_default: boolean,
  location_area_encounters: string,
  moves: [],
}

export type Ability = {
  ability: {
    name: string,
    url: string
  },
  is_hidden: boolean,
  slot: number
}

export type Form = {
  name: string,
  url: string
}

export type GameIndex = {
  game_index: number,
  version: {
    name: string,
    url: string,
  }
}

export type HeldItem = {
  item: Item,
  version_details: VersionDetail[]
}

export type Item = {
  name: string,
  url: string
}

export type VersionDetail = {
  rarity: number,
  version: {
    name: string,
    url: string
  }
}

export type MoveLearnMethod = {
  name: string,
  url: string
}

export type VersionGroup = {
  name: string,
  url: string,
}

export type Move = {
  name: string,
  url: string,
}

export type VersionGroupDetail = {
  level_learned_at: number,
  move_learn_method: MoveLearnMethod,
  order: number | null,
  version_group: VersionGroup
}
