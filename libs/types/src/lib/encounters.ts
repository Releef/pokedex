import { NamedAPIResource, Name } from './common';

export interface EncounterMethod {
  id: number;
  name: string;
  order: number;
  names: Name[];
}

export interface EncounterCondition {
  id: number;
  name: string;
  names: Name[];
  values: NamedAPIResource[]; // EncounterConditionValue
}

export interface EncounterConditionValue {
  id: number;
  name: string;
  condition: NamedAPIResource; // EncounterCondition
  names: Name[];
}
