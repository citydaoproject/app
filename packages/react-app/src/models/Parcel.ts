import { BigNumber } from "@ethersproject/bignumber";

export interface Parcel {
  id: BigNumber;
  uri: string;
  price: number;
  geojson?: any;
}
