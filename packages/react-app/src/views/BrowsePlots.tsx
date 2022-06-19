import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useContractLoader, useAppSelector, useAppDispatch, useUserSigner } from "../hooks";
import { PlotMap, ProgressBar, PlotDetail, LogoDisplay, Header } from "../components";
import { setPlots } from "../actions";
import { PlotTabs } from "../components";
import { Plot } from "../models/Plot";
import { logoutOfWeb3Modal } from "../helpers";
import { fetchedPlots, setCommunalLand, setParcelGeojson } from "../actions/plotsSlice";
import { fetchMetadata } from "../data";
import updatePlots from "../helpers/UpdatePlots";
import { setWhitelistedAmount } from "../actions/userSlice";

interface Props {
  networkProvider: any;
  web3Modal: any;
}

export default function BrowsePlots({ networkProvider, web3Modal }: Props) {
  const dispatch = useAppDispatch();
  const DEBUG = useAppSelector(state => state.debug.debug);
  const plots = useAppSelector(state => state.plots.plots);
  const activePlot = useAppSelector(state => state.plots.activePlot);
  const parcel = useAppSelector(state => state.plots.parcel);
  const userAddress = useAppSelector(state => state.user.address);
  const contracts: any = useContractLoader(networkProvider);
  const whitelistedAmount = useAppSelector(state => state.user.whitelistedAmount);
  const [injectedProvider, setInjectedProvider] = useState<ethers.providers.Web3Provider>();

  useUserSigner(injectedProvider); // initialize signer

  useEffect(() => {
    if (!userAddress) {
      return;
    }
    if (whitelistedAmount && whitelistedAmount > 0) {
      toast.dismiss("notWhitelisted");
      toast.success(`You've been whitelisted to buy ${whitelistedAmount} plots 🎉`, {
        toastId: "isWhitelisted",
        autoClose: false,
      });
    } else {
      toast.dismiss("isWhitelisted");
      toast.error("You aren't whitelisted to buy any plots yet 😢", {
        toastId: "notWhitelisted",
        autoClose: false,
      });
    }
  }, [whitelistedAmount, userAddress]);

  const loadWeb3Modal = useCallback(async () => {
    try {
      const provider = await web3Modal.connect();

      setInjectedProvider(new ethers.providers.Web3Provider(provider));

      provider.on("chainChanged", (chainId: string) => {
        DEBUG && console.log(`chain changed to ${chainId}! updating providers`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });

      provider.on("accountsChanged", () => {
        DEBUG && console.log(`account changed!`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code: string, reason: string) => {
        DEBUG && console.log(code, reason);
        logoutOfWeb3Modal(web3Modal);
      });
    } catch (error) {
      toast.error("Error connecting to a wallet");
    }
  }, [setInjectedProvider, DEBUG]);

  const readParcel = async () => {
    try {
      if (contracts && contracts.CityDaoParcel) {
        const parcelUri = await contracts.CityDaoParcel.getParcelMetadataUri();
        const parcelManifestBuffer = await fetchMetadata(parcelUri);
        const parcelMetadata = JSON.parse(parcelManifestBuffer.toString()) as any;
        dispatch(setParcelGeojson(parcelMetadata.plots[0] as any));

        const communalUri = await contracts.CityDaoParcel.getCommunalLandMetadataUri();
        const communalManifestBuffer = await fetchMetadata(communalUri);
        const communalMetadata = JSON.parse(communalManifestBuffer.toString()) as any;
        dispatch(setCommunalLand(communalMetadata.features as any[]));
      }
    } catch (e) {
      toast.error(`Failed to find parcel. Make sure you're on the ${process.env.REACT_APP_NETWORK} network.`, {
        className: "error",
        toastId: "contract-fail",
      });
      DEBUG && console.log(e);
    }
  };

  useEffect(() => {
    readParcel();
  }, [contracts]);

  const readWhitelistStatus = async () => {
    try {
      if (contracts && contracts.CityDaoParcel && userAddress) {
        const whitelistedAmount = await contracts.CityDaoParcel.getWhitelistedAmount(userAddress);
        dispatch(setWhitelistedAmount(whitelistedAmount.toNumber()));
      }
    } catch (e) {
      dispatch(setWhitelistedAmount(0));
    }
  };

  useEffect(() => {
    readWhitelistStatus();
  }, [contracts, userAddress, plots]);

  updatePlots(contracts, plots, DEBUG).then((newPlots: Plot[]) => {
    if (newPlots.length !== plots.length) {
      dispatch(setPlots(newPlots));
      dispatch(fetchedPlots());
    }
  });

  return (
    <div className="browse-plots-wrapper">
      <ProgressBar />
      <Link to="/whitelist" className="logo-link">
        <LogoDisplay />
      </Link>
      {activePlot !== undefined ? (
        <PlotDetail plot={activePlot} contracts={contracts} injectedProvider={injectedProvider} />
      ) : (
        <PlotTabs />
      )}
      <Header connectWallet={loadWeb3Modal} />
      {/* key prop is to cause rerendering whenever it changes */}
      <PlotMap
        key={plots.length}
        parcel={parcel}
        plots={plots}
        startingCoordinates={[-109.25689639464197, 44.922331600075466]}
        startingZoom={15.825123438299038}
        startingPitch={20}
      />
    </div>
  );
}
