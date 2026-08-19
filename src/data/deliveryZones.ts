export interface DeliveryZone {
  name: string;
  minimum: number;
}

// Single source of truth for delivery zones and their minimum order amounts.
// Do not duplicate these values elsewhere — import from here.
export const DELIVERY_ZONES: DeliveryZone[] = [
  { name: 'Vracar', minimum: 2500 },
  { name: 'Usce', minimum: 2500 },
  { name: 'Staro sajmiste', minimum: 2500 },
  { name: 'Akademija', minimum: 2500 },
  { name: 'Dunavski kej', minimum: 2500 },
  { name: 'Paviljoni', minimum: 1500 },
  { name: 'Fontana', minimum: 1500 },
  { name: 'Studentski grad', minimum: 1500 },
  { name: 'Gazela', minimum: 2500 },
  { name: 'Stari aerodrom', minimum: 1500 },
  { name: 'Savski kej', minimum: 1500 },
  { name: 'Mladost', minimum: 900 },
  { name: 'Blokovi', minimum: 900 },
  { name: 'Sava', minimum: 900 },
  { name: 'Bezanija', minimum: 900 },
  { name: 'Bezanijska kosa', minimum: 900 },
  { name: 'Ledine', minimum: 1500 },
  { name: 'Kalvarija', minimum: 1500 },
  { name: 'Gornji grad', minimum: 2500 },
  { name: 'Stara i nova Galenika', minimum: 2500 },
  { name: 'Altina', minimum: 2500 },
  { name: 'Kvantas', minimum: 900 },
  { name: 'Zemun', minimum: 1500 },
  { name: 'Galenika', minimum: 2500 },
  { name: 'Novi Grad', minimum: 1500 },
  { name: 'Zmaj', minimum: 2500 },
  { name: 'Radiofar', minimum: 2500 },
  { name: 'Surcin', minimum: 3500 },
  { name: 'Aerodrom', minimum: 3500 },
  { name: 'Expo', minimum: 3500 },
].sort((a, b) => a.name.localeCompare(b.name, 'sr'));

const ZONES_BY_NAME: Record<string, DeliveryZone> = DELIVERY_ZONES.reduce(
  (acc, zone) => {
    acc[zone.name] = zone;
    return acc;
  },
  {} as Record<string, DeliveryZone>,
);

export function getZoneByName(name: string | undefined | null): DeliveryZone | undefined {
  return name ? ZONES_BY_NAME[name] : undefined;
}

export function getZoneMinimum(name: string | undefined | null): number | undefined {
  return getZoneByName(name)?.minimum;
}
