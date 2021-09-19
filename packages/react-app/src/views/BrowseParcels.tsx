import React from "react";
import { Col, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

import { Transactor } from "../helpers";
import { useUpdateParcels, useUserSigner, useContractLoader, useAppSelector, useAppDispatch } from "../hooks";
import { ParcelMap, ProgressBar, ParcelDetail } from "../components";
import { setParcels } from "../actions";
import ParcelTabs from "../components/ParcelTabs";

interface Props {
  injectedProvider: any;
}

export default function BrowseParcels({ injectedProvider }: Props) {
  const dispatch = useAppDispatch();
  const DEBUG = useAppSelector(state => state.debug.debug);
  const parcels = useAppSelector(state => state.parcels.parcels);
  const activeParcel = useAppSelector(state => state.parcels.activeParcel);
  const contracts: any = useContractLoader(injectedProvider);

  useUpdateParcels(contracts, DEBUG).then(newParcels => {
    if (newParcels.length !== parcels.length) dispatch(setParcels(newParcels));
  });

  return (
    <div className="flex flex-col flex-grow">
      <ProgressBar />
      <div className="flex flex-row flex-grow">
        <Col className="w-96">
          {activeParcel !== undefined ? (
            <ParcelDetail parcel={activeParcel} injectedProvider={injectedProvider} />
          ) : (
            <ParcelTabs />
          )}
        </Col>
        <Layout className="site-layout">
          <Content className="flex flex-col">
            {/* key prop is to cause rerendering whenever it changes */}
            <ParcelMap
              key={parcels.length}
              parcels={parcels}
              startingCoordinates={[-106.331, 43.172]}
              startingZoom={9}
              startingPitch={60}
            />
          </Content>
        </Layout>
      </div>
    </div>
  );
}
