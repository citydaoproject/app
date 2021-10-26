import { ethers } from "ethers";
import { toast } from "react-toastify";
import { fetchPlotMetadata } from "../data";
import { Plot, PlotMetadata } from "../models/Plot";
import { GeojsonData } from "../models/GeojsonData";

const useUpdatePlots = async (readContracts: any, currentPlots = [] as Plot[], DEBUG = false) => {
  const newPlots: Plot[] = [];
  if (readContracts) {
    try {
      const plotIds = await readContracts.CityDaoParcel.getPlotIds();
      const ipfsHash = await readContracts.CityDaoParcel.getMetadataUri();
      const jsonManifestBuffer = await fetchPlotMetadata(ipfsHash);
      const plotsMetadata = JSON.parse(jsonManifestBuffer.toString()) as GeojsonData;
      for (let index = 0; index < plotIds.length; index++) {
        const plotId = plotIds[index];
        const isSold = await readContracts.CityDaoParcel.isSold(plotId);
        const price = !isSold ? await readContracts.CityDaoParcel.getPrice(plotId) : undefined;
        const owner = isSold ? await readContracts.CityDaoParcel.ownerOf(plotId) : undefined;
        try {
          let metadata: PlotMetadata = {};
          if (currentPlots.includes(plotIds[index])) {
            metadata = currentPlots[index].metadata ?? {};
          } else {
            metadata = { geojson: plotsMetadata.plots[index] ?? {} };
          }
          newPlots.push({
            id: plotId.toNumber(),
            parcel: 0,
            price: price ? ethers.utils.formatEther(price) : undefined,
            sold: isSold,
            owner: owner,
            metadata: metadata,
          });
        } catch (e) {
          toast.error("Failed to read plot metadata. Please try again or contact CityDAO support.", {
            className: "error",
            toastId: "error-reading-metadata",
          });
          DEBUG && console.log(e);
        }
      }
    } catch (e) {
      toast.error(
        `Failed to find CityDAO's contract. Make sure you're on the ${process.env.REACT_APP_NETWORK} network.`,
        {
          className: "error",
          toastId: "contract-fail",
        },
      );
      DEBUG && console.log(e);
    }
  }
  return newPlots;
};

export default useUpdatePlots;
