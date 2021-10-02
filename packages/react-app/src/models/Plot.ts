export interface Plot {
  id: number;
  parcel: number;
  uri: string;
  sold: boolean;
  owner: string;
  price?: number;
  geojson?: any;
  sqft?: number;
  acres?: number;
  location?: string;
  coordinates?: string;
}
