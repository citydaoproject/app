import React, { useCallback, useState } from "react";
import { Col, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { ethers } from "ethers";

import { useUpdatePlots, useContractLoader, useAppSelector, useAppDispatch, useUserSigner } from "../hooks";
import { PlotMap, ProgressBar, PlotDetail, LogoDisplay, Header } from "../components";
import { setPlots } from "../actions";
import { PlotTabs } from "../components";
import { Plot } from "../models/Plot";
import { logoutOfWeb3Modal } from "../helpers";
import { fetchedPlots } from "../actions/plotsSlice";

interface Props {
  networkProvider: any;
  web3Modal: any;
}

export default function BrowsePlots({ networkProvider, web3Modal }: Props) {
  const dispatch = useAppDispatch();
  const DEBUG = useAppSelector(state => state.debug.debug);
  const plots = useAppSelector(state => state.plots.plots);
  const activePlot = useAppSelector(state => state.plots.activePlot);
  const contracts: any = useContractLoader(networkProvider);
  const [injectedProvider, setInjectedProvider] = useState<ethers.providers.Web3Provider>();

  useUserSigner(injectedProvider); // initialize signer

  const loadWeb3Modal = useCallback(async () => {
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
  }, [setInjectedProvider, DEBUG]);

  useUpdatePlots(contracts, DEBUG).then((newPlots: Plot[]) => {
    if (newPlots.length !== plots.length) {
      dispatch(setPlots(newPlots));
      dispatch(fetchedPlots());
    }
  });

  return (
    <div className="flex flex-col flex-grow">
      <ProgressBar />
      <div className="flex flex-row flex-grow">
        <Col className="sidebar">
          <LogoDisplay />
          {activePlot !== undefined ? (
            <PlotDetail plot={activePlot} injectedProvider={injectedProvider} />
          ) : (
            <PlotTabs />
          )}
        </Col>
        <Layout className="site-layout">
          <Content className="flex flex-col">
            <Header connectWallet={loadWeb3Modal} />
            {/* key prop is to cause rerendering whenever it changes */}
            <PlotMap
              key={plots.length}
              plots={plots}
              startingCoordinates={[-109.25792011522043, 44.92118759558491]}
              startingZoom={15.825123438299038}
              startingPitch={52.499999999999964}
            />
          </Content>
        </Layout>
      </div>
    </div>
  );
}
