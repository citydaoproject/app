import { useState, useEffect, useCallback } from "react";
import { PARCEL_0_OPENSEA_ID, LAST_ALLOCATED_PLOT_ID } from "../constants";

export const useGetNftMetadata = (activeAssetId: number | undefined) => {
  const [prevCalledId, setPrevCalledId] = useState(0);
  const [nftMetaData, setNftMetaData] = useState<any>();
  const shouldFetch = activeAssetId !== prevCalledId;

  useEffect(() => {
    if (!activeAssetId) return;
    setPrevCalledId(activeAssetId);
  }, [activeAssetId]);

  const fetchBalance = useCallback(async () => {
    const options = { method: "GET" };

    if (activeAssetId !== undefined && activeAssetId <= LAST_ALLOCATED_PLOT_ID) {
      shouldFetch &&
        fetch(
          `/api/v1/asset/${PARCEL_0_OPENSEA_ID}/${activeAssetId.toString()}/?include_orders=false`, // TODO trkaplan make this URI conditional for local testing
          options,
        )
          .then(response => response.json())
          .then(response => setNftMetaData(response))
          .catch(err => {
            console.error(err);
            setNftMetaData(null);
          });
    } else if (activeAssetId !== undefined && activeAssetId > LAST_ALLOCATED_PLOT_ID) {
      setNftMetaData({
        owner: {
          address: "N/A"
        }
      })
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
