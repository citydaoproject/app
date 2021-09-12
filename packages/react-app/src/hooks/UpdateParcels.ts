import { BigNumber } from "@ethersproject/bignumber";
import { fetchParcelMetadata } from "../data";
import { Parcel } from "../models/Parcel";

const useUpdateParcels = async (readContracts: any, DEBUG = false) => {
  let newParcels: Parcel[] = [];
  if (readContracts) {
    const listedParcelIds = (await readContracts.CityDaoParcel.getListedParcelIds()).filter((id: BigNumber) =>
      id.gt(0),
    ); // 0 is the null id
    const listedParcelURIs = (await readContracts.CityDaoParcel.getListedParcelURIs()).filter(
      (uri: string) => uri.length > 0,
    ); // remove nulls
    const soldParcelIds = (await readContracts.CityDaoParcel.getSoldParcelIds()).filter((id: BigNumber) => id.gt(0)); // 0 is the null id
    const soldParcelURIs = (await readContracts.CityDaoParcel.getSoldParcelURIs()).filter(
      (uri: string) => uri.length > 0,
    ); // remove nulls
    const listedParcels = await getParcelsFromIds(listedParcelIds, listedParcelURIs, false, readContracts, DEBUG);
    const soldParcels = await getParcelsFromIds(soldParcelIds, soldParcelURIs, true, readContracts, DEBUG);
    newParcels = [...listedParcels, ...soldParcels];
  }
  return newParcels;
};

const getParcelsFromIds = async (
  parcelIds: BigNumber[],
  parcelURIs: string[],
  isSold: boolean,
  readContracts: any,
  DEBUG = false,
) => {
  const parcels: Parcel[] = [];
  for (var index = 0; index < parcelIds.length; index++) {
    const parcelId = parcelIds[index];
    const ipfsHash = parcelURIs[index];
    const price = !isSold ? await readContracts.CityDaoParcel.getPrice(parcelId) : undefined;
    try {
      const jsonManifestBuffer = await fetchParcelMetadata(ipfsHash);
      try {
        const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
        parcels.push({ id: parcelId.toNumber(), uri: ipfsHash, price: price, sold: isSold, ...jsonManifest });
      } catch (e) {
        DEBUG && console.log(e);
      }
    } catch (e) {
      DEBUG && console.log(e);
    }
  }
  return parcels;
};

export default useUpdateParcels;
