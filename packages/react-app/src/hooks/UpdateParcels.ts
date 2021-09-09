import { fetchParcelMetadata } from "../data";
import { Parcel } from "../models/Parcel";

const useUpdateParcels = async (readContracts: any, DEBUG = false) => {
  var newParcels: Parcel[] = [];
  if (readContracts) {
    const parcelIds = await readContracts.CityDaoParcel.getParcelIds();
    const parcelURIs = await readContracts.CityDaoParcel.getListedParcels();
    for (var index = 0; index < parcelIds.length; index++) {
      const parcelId = parcelIds[index];
      const ipfsHash = parcelURIs[parcelId];
      const price = await readContracts.CityDaoParcel.getPrice(parcelId);
      if (ipfsHash !== "") {
        // skip sold parcels
        try {
          const jsonManifestBuffer = await fetchParcelMetadata(ipfsHash);
          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            newParcels.push({ id: parcelId.toNumber(), uri: ipfsHash, price: price, ...jsonManifest });
          } catch (e) {
            DEBUG && console.log(e);
          }
        } catch (e) {
          DEBUG && console.log(e);
        }
      }
    }
  }
  return newParcels;
};

export default useUpdateParcels;
