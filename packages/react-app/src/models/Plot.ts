export interface PlotMetadata {
  geojson?: any;
  sqft?: number;
  location?: string;
  coordinates?: string;
}

export interface Plot {
  id: number;
  geometry: any;
  properties: any;
  bbox: any;
  type: string;
}