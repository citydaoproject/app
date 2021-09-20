export interface Parcel {
  id: number;
  uri: string;
  sold: boolean;
  price?: number;
  geojson?: any;
  sqft?: number;
  acres?: number;
  location?: string;
  coordinates?: string;
}
