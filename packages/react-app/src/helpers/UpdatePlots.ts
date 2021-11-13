import { ethers } from "ethers";
import { toast } from "react-toastify";
import { fetchMetadata } from "../data";
import { Plot, PlotMetadata } from "../models/Plot";
import { GeojsonData } from "../models/GeojsonData";

const updatePlots = async (readContracts: any, currentPlots = [] as Plot[], DEBUG = false) => {
  const newPlots: Plot[] = [];
  if (readContracts) {
    try {
      const plotIds = await readContracts.CityDaoParcel.getPlotIds();
      const plotPrices = await readContracts.CityDaoParcel.getAllPrices();
      const statuses = await readContracts.CityDaoParcel.getAllSoldStatus();
      const owners = await readContracts.CityDaoParcel.getOwners();
      const ipfsHash = await readContracts.CityDaoParcel.getPlotsMetadataUri();
      const jsonManifestBuffer = await fetchMetadata(ipfsHash);
      const plotsMetadata = JSON.parse(jsonManifestBuffer.toString()) as GeojsonData;
      for (let index = 0; index < plotIds.length; index++) {
        const plotId = plotIds[index];
        const isSold = statuses[index];
        const price = !isSold ? plotPrices[index] : undefined;
        const owner = owners[index] ?? "";
        try {
          let metadata: PlotMetadata = {};
          if (currentPlots.includes(plotIds[index])) {
            metadata = currentPlots[index].metadata ?? {};
          } else {
            // geojson uses lng, lat (rather than lat, lng)
            const lng = plotsMetadata.plots[index]?.geometry?.coordinates[0][0][0] ?? null;
            const lat = plotsMetadata.plots[index]?.geometry?.coordinates[0][0][1] ?? null;
            metadata = {
              geojson: plotsMetadata.plots[index] ?? {},
              coordinates: lat && lng ? `${lat}${lat >= 0 ? "°N" : "°S"}, ${lng}${lng >= 0 ? "°E" : "°W"}` : undefined,
              location: "Clark, WY",
            };
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

export default updatePlots;
