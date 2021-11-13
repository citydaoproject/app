export interface Plot {
  id: number;
  parcel: number;
  sold: boolean;
  owner: string;
  price?: string;
  metadata: PlotMetadata;
}

export interface PlotMetadata {
  geojson?: any;
  sqft?: number;
  location?: string;
  coordinates?: string;
}
