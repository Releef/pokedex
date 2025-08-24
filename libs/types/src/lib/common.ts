// Common foundational types for PokeAPI
// Reference: https://pokeapi.co/

export type ResourceId = number;

export interface APIResource {
  url: string;
}

export interface NamedAPIResource<T = any> extends APIResource {
  name: string;
}

export interface Name {
  name: string;
  language: NamedAPIResource;
}

export interface Description {
  description: string;
  language: NamedAPIResource;
}

export interface Effect {
  effect: string;
  language: NamedAPIResource;
}

export interface VerboseEffect {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}

export interface FlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version?: NamedAPIResource;
}

export interface GenerationGameIndex {
  game_index: number;
  generation: NamedAPIResource;
}

export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

export interface VersionEncounterDetail {
  version: NamedAPIResource; // Version
  max_chance: number;
  encounter_details: EncounterDetail[];
}

export interface EncounterDetail {
  min_level: number;
  max_level: number;
  condition_values: NamedAPIResource[]; // EncounterConditionValue
  chance: number;
  method: NamedAPIResource; // EncounterMethod
}

export interface MachineVersionDetail {
  machine: APIResource; // Machine
  version_group: NamedAPIResource; // VersionGroup
}

export interface NamedResourceList<T = NamedAPIResource> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ResourceList<T = APIResource> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
