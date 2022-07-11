import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useContractLoader, useAppSelector, useAppDispatch, useUserSigner } from "../hooks";
import { PlotMap, LogoDisplay, Header, SidePanel } from "../components";
import { SearchPlots } from "../components";
import { logoutOfWeb3Modal } from "../helpers";

interface Props {
  networkProvider: any;
  web3Modal: any;
  mainnetProvider: any;
}

export default function BrowsePlots({ networkProvider, web3Modal, mainnetProvider }: Props) {
  const DEBUG = useAppSelector(state => state.debug.debug);
  const plots = useAppSelector(state => state.plots.plots);
  const userAddress = useAppSelector(state => state.user.address);
  const contracts: any = useContractLoader(networkProvider);
  const [injectedProvider, setInjectedProvider] = useState<ethers.providers.Web3Provider>();
  const [userNft, setUserNft] = useState<Array<number>>([]);
  const [isParcelCountRead, setIsParcelCountRead] = useState(false);

  const signer = useUserSigner(injectedProvider); // initialize signer

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

  const readOwnedParcelCount = async () => {
    try {
      if (contracts && contracts.CitizenNFT && userAddress) {
        console.log("setIsParcelCountRead");
        setIsParcelCountRead(false);
        const balanceOfFunc = await contracts.CityDaoParcel.connect(signer)["balanceOf"];
        const numParcel = await balanceOfFunc(userAddress);
        readOwnedParcelID(numParcel.toNumber());
        setIsParcelCountRead(true);
      }
    } catch (e) { }
  };

  const getTokenId = async (index: number) => {
    return new Promise<number>(async resolve => {
      const tokenOfOwnerByIndex = await contracts.CityDaoParcel.connect(signer)["tokenOfOwnerByIndex"];
      const tokenId = await tokenOfOwnerByIndex(userAddress, index);
      resolve(tokenId.toNumber());
    });
  };

  const readOwnedParcelID = async (count: number) => {
    const idList = [];
    for (let i = 0; i < count; i++) {
      const tokenId = await getTokenId(i);
      idList.push(tokenId);
    }
    setUserNft(idList);
  };

  useEffect(() => {
    readOwnedParcelCount();
  }, [contracts, userAddress]);

  return (
    <div className="browse-plots-wrapper">
      <div className="logo-display flex items-center justify-between h-16 border-b pb-px">
        <LogoDisplay />
        <SearchPlots />
      </div>

      <Header
        userAddress={userAddress}
        connectWallet={loadWeb3Modal}
        userNft={userNft.length}
        isParcelCountRead={isParcelCountRead}
      />
      <SidePanel
        contracts={contracts}
        injectedProvider={injectedProvider}
        mainnetProvider={mainnetProvider}
        userNft={userNft}
      />

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
