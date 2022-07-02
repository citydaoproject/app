import { useState, useEffect, useCallback } from "react";
import { setActivePlotNftData } from "../actions/plotsSlice";
import { PARCEL_0_OPENSEA_ID } from "../constants";
import { useAppDispatch } from "./";

export const useGetNftMetadata = (activeAssetId: number | undefined) => {
  const dispatch = useAppDispatch();
  const [prevCalledId, setPrevCalledId] = useState(0);
  const [nftMetaData, setNftMetaData] = useState<any>();
  const shouldFetch = activeAssetId !== prevCalledId;

  useEffect(() => {
    if (!activeAssetId) return;
    setPrevCalledId(activeAssetId);
  }, [activeAssetId]);

  const fetchBalance = useCallback(async () => {
    const options = { method: "GET", headers: { "X-API-KEY": process.env.REACT_APP_OPENSEA_TOKEN ?? "" } };

    if (activeAssetId !== undefined) {
      shouldFetch &&
        fetch(
          `https://api.opensea.io/api/v1/asset/${PARCEL_0_OPENSEA_ID}/${activeAssetId.toString()}/?include_orders=false`,
          options,
        )
          .then(response => response.json())
          .then(response => setNftMetaData(response))
          .catch(err => console.error(err));
    }
  }, [activeAssetId])

  useEffect(() => {
    if (activeAssetId) {
      if (!activeAssetId) {
        setPrevCalledId(activeAssetId);
      }
      fetchBalance()
    }
  }, [activeAssetId])

  return nftMetaData;
};
