import { NamedAPIResource } from './common';

export interface GrowthRate {
  id: number;
  name: string;
  formula: string;
  descriptions: { description: string; language: NamedAPIResource }[];
  levels: { level: number; experience: number }[];
  pokemon_species: NamedAPIResource[];
}
