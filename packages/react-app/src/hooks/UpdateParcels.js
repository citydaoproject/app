import { fetchParcelMetadata } from "../data";

const useUpdateParcels = async (currentParcels, setParcels, contractToRead, forceUpdate = false) => {
  var newParcels = [];
  if (currentParcels.length > 0 && !forceUpdate) return; // prevent excessive calls to IPFS
  if (contractToRead) {
    const parcelIds = await contractToRead.CityDaoParcel.getParcelIds();
    const parcelURIs = await contractToRead.CityDaoParcel.getListedParcels();
    for (var index = 0; index < parcelIds.length; index++) {
      const parcelId = parcelIds[index];
      const ipfsHash = parcelURIs[parcelId];
      const price = await contractToRead.CityDaoParcel.getPrice(parcelId);
      if (ipfsHash !== "") {
        // skip sold parcels
        try {
          const jsonManifestBuffer = await fetchParcelMetadata(ipfsHash);
          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            newParcels.push({ id: parcelId, uri: ipfsHash, price: price, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
    if (newParcels.length !== currentParcels.length) {
      console.log("📦 Parcels:", newParcels);
      setParcels(newParcels);
    }
  }
};

export default useUpdateParcels;
