import { toast } from "react-toastify";
import { fetchParcelMetadata } from "../data";
import { Parcel } from "../models/Parcel";

const useUpdateParcels = async (readContracts: any, DEBUG = false) => {
  let newParcels: Parcel[] = [];
  if (readContracts) {
    try {
      const parcelIds = await readContracts.CityDaoParcel.getParcelIds();
      const parcelURIs = await readContracts.CityDaoParcel.getParcelURIs();
      for (var index = 0; index < parcelIds.length; index++) {
        const parcelId = parcelIds[index];
        const ipfsHash = parcelURIs[index];
        const isSold = await readContracts.CityDaoParcel.isSold(parcelId);
        const price = !isSold ? await readContracts.CityDaoParcel.getPrice(parcelId) : undefined;
        try {
          const jsonManifestBuffer = await fetchParcelMetadata(ipfsHash);
          const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
          newParcels.push({ id: parcelId.toNumber(), uri: ipfsHash, price: price, sold: isSold, ...jsonManifest });
        } catch (e) {
          toast.error("Failed to read parcel metadata. Please try again or contact CityDAO support.");
          DEBUG && console.log(e);
        }
      }
    } catch (e) {
      toast.error("Failed to read parcel metadata. Please try again or contact CityDAO support.", {
        className: "error",
      });
      DEBUG && console.log(e);
    }
  }
  return newParcels;
};

export default useUpdateParcels;
