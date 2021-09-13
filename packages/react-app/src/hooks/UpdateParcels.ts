import { fetchParcelMetadata } from "../data";
import { Parcel } from "../models/Parcel";

const useUpdateParcels = async (readContracts: any, DEBUG = false) => {
  let newParcels: Parcel[] = [];
  if (readContracts) {
    const parcelIds = await readContracts.CityDaoParcel.getParcelIds();
    const parcelURIs = await readContracts.CityDaoParcel.getParcelURIs();
    for (var index = 0; index < parcelIds.length; index++) {
      const parcelId = parcelIds[index];
      const ipfsHash = parcelURIs[index];
      const isSold = await readContracts.CityDaoParcel.isSold(parcelId);
      const price = !isSold ? await readContracts.CityDaoParcel.getPrice(parcelId) : undefined;
      try {
        const jsonManifestBuffer = await fetchParcelMetadata(ipfsHash);
        try {
          const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
          newParcels.push({ id: parcelId.toNumber(), uri: ipfsHash, price: price, sold: isSold, ...jsonManifest });
        } catch (e) {
          DEBUG && console.log(e);
        }
      } catch (e) {
        DEBUG && console.log(e);
      }
    }
  }
  return newParcels;
};

export default useUpdateParcels;
