export interface Plot {
  id: number;
  parcel: number;
  uri: string;
  sold: boolean;
  owner: string;
  price?: number;
  metadata: PlotMetadata;
}

export interface PlotMetadata {
  geojson?: any;
  sqft?: number;
  acres?: number;
  location?: string;
  coordinates?: string;
}
