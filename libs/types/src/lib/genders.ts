import { NamedAPIResource } from './common';

export interface Gender {
  id: number;
  name: string;
  pokemon_species_details: { rate: number; pokemon_species: NamedAPIResource }[];
  required_for_evolution: NamedAPIResource[]; // Species
}
