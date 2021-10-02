import React from "react";
import { Col, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

import { useUpdatePlots, useContractLoader, useAppSelector, useAppDispatch } from "../hooks";
import { PlotMap, ProgressBar, PlotDetail, LogoDisplay, Header } from "../components";
import { setPlots } from "../actions";
import { PlotTabs } from "../components";
import { Plot } from "../models/Plot";

interface Props {
  networkProvider: any;
  injectedProvider: any;
}

export default function BrowsePlots({ networkProvider, injectedProvider }: Props) {
  const dispatch = useAppDispatch();
  const DEBUG = useAppSelector(state => state.debug.debug);
  const plots = useAppSelector(state => state.plots.plots);
  const activePlot = useAppSelector(state => state.plots.activePlot);
  const contracts: any = useContractLoader(networkProvider);

  useUpdatePlots(contracts, DEBUG).then((newPlots: Plot[]) => {
    if (newPlots.length !== plots.length) dispatch(setPlots(newPlots));
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
            <Header />
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
