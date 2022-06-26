import { useState, useEffect } from "react";
import { setActivePlotNftData } from "../actions/plotsSlice";
import { PARCEL_0_OPENSEA_ID } from "../constants";
import { useAppDispatch } from "./";

export const useGetNftMetadata = (activeAssetId: number) => {
  const dispatch = useAppDispatch();
  const [prevCalledId, setPrevCalledId] = useState(0);
  const shouldFetch = activeAssetId !== prevCalledId;

  useEffect(() => {
    if (!activeAssetId) return;
    setPrevCalledId(activeAssetId);
  }, [activeAssetId]);

  const getNftMetadata = () => {
    const options = { method: "GET", headers: { "X-API-KEY": process.env.REACT_APP_OPENSEA_TOKEN ?? "" } };

    if (activeAssetId !== undefined) {
      shouldFetch &&
        fetch(
          `https://api.opensea.io/api/v1/asset/${PARCEL_0_OPENSEA_ID}/${activeAssetId.toString()}/?include_orders=false`,
          options,
        )
          .then(response => response.json())
          .then(response => dispatch(setActivePlotNftData(response)))
          .catch(err => console.error(err));
    }

    return;
  };

  return getNftMetadata;
};
