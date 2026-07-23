export type FarmerSpecialty =
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'dairy'
  | 'herbs'
  | 'honey'
  | 'organic'
  | 'hydroponic';

export interface SpecialtyTag {
  label: string;
  /** Color family for the pill (matches farmers.html color coding). */
  color: 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'yellow';
}

export interface Farmer {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  description: string;
  farmSize: string;
  productCount: number;
  specialties: SpecialtyTag[];
  certified: boolean;
  /** Year the farmer joined — shown as "Farmer since {year}". */
  since: number;
  phone: string;
}
