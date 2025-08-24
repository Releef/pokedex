import { NamedAPIResource } from './common';

export interface Machine {
  id: number;
  item: NamedAPIResource; // Item
  move: NamedAPIResource; // Move
  version_group: NamedAPIResource; // VersionGroup
}
