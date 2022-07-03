import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useContractLoader, useAppSelector, useAppDispatch, useUserSigner } from "../hooks";
import { PlotMap, LogoDisplay, Header, SidePanel } from "../components";
import { SearchPlots } from "../components";
import { logoutOfWeb3Modal } from "../helpers";
import { setWhitelistedAmount } from "../actions/userSlice";

interface Props {
  networkProvider: any;
  web3Modal: any;
  mainnetProvider: ethers.providers.StaticJsonRpcProvider | null;
}

export default function BrowsePlots({ networkProvider, web3Modal, mainnetProvider }: Props) {
  const dispatch = useAppDispatch();
  const DEBUG = useAppSelector(state => state.debug.debug);
  const plots = useAppSelector(state => state.plots.plots);
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
      toast.error(
        "You don’t own a Parcel-0 NFT in your wallet: " + userAddress?.slice(0, 6) + "..." + userAddress?.slice(-5, -1),
        {
          toastId: "notWhitelisted",
          autoClose: false,
        },
      );
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

  return (
    <div className="browse-plots-wrapper">
      <div className="logo-display flex items-center justify-between h-16 border-b pb-px">
        <Link to="/whitelist" className="logo-link">
          <LogoDisplay />
        </Link>
        <SearchPlots />
      </div>

      <Header connectWallet={loadWeb3Modal} />
      <SidePanel contracts={contracts} injectedProvider={injectedProvider} mainnetProvider={mainnetProvider} />

      {/* key prop is to cause rerendering whenever it changes */}
      <PlotMap
        key={plots.length}
        startingCoordinates={[-109.25689639464197, 44.922331600075466]}
        startingZoom={15.825123438299038}
        startingPitch={20}
      />
    </div>
  );
}
