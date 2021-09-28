import { fetchPlotMetadata } from "../data";
import { Plot } from "../models/Plot";

const useUpdatePlots = async (readContracts: any, DEBUG = false) => {
  let newPlots: Plot[] = [];
  if (readContracts) {
    const plotIds = await readContracts.CityDaoParcel.getPlotIds();
    const plotURIs = await readContracts.CityDaoParcel.getPlotURIs();
    for (var index = 0; index < plotIds.length; index++) {
      const plotId = plotIds[index];
      const ipfsHash = plotURIs[index];
      const isSold = await readContracts.CityDaoParcel.isSold(plotId);
      const price = !isSold ? await readContracts.CityDaoParcel.getPrice(plotId) : undefined;
      try {
        const jsonManifestBuffer = await fetchPlotMetadata(ipfsHash);
        try {
          const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
          newPlots.push({
            id: plotId.toNumber(),
            parcel: 0,
            uri: ipfsHash,
            price: price,
            sold: isSold,
            ...jsonManifest,
          });
        } catch (e) {
          DEBUG && console.log(e);
        }
      } catch (e) {
        DEBUG && console.log(e);
      }
    }
  }
  return newPlots;
};

export default useUpdatePlots;
