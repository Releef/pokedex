export function typeClass(t: string | null | undefined): string {
  const key = (t ?? '').toString().toLowerCase();
  switch (key) {
    case 'grass':
      return 'type-chip--grass green';
    case 'fire':
      return 'type-chip--fire orange';
    case 'water':
      return 'type-chip--water blue';
    case 'electric':
      return 'type-chip--electric yellow';
    case 'poison':
      return 'type-chip--poison purple';
    case 'ghost':
      return 'type-chip--ghost indigo';
    case 'normal':
      return 'type-chip--normal gray';
    case 'fairy':
      return 'type-chip--fairy pink';
    default:
      return 'type-chip--default gray';
  }
}
