import { NamedAPIResource, Name } from './common';

export interface Berry {
  id: number;
  name: string;
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number | null;
  size: number;
  smoothness: number;
  soil_dryness: number;
  firmness: NamedAPIResource; // BerryFirmness
  flavors: { potency: number; flavor: NamedAPIResource }[];
  item: NamedAPIResource; // Item
  natural_gift_type: NamedAPIResource | null; // Type
}

export interface BerryFirmness {
  id: number;
  name: string;
  berries: NamedAPIResource[]; // Berry
  names: Name[];
}

export interface BerryFlavor {
  id: number;
  name: string;
  berries: { potency: number; berry: NamedAPIResource }[];
  contest_type: NamedAPIResource; // ContestType
  names: Name[];
}
