import React from "react";
import { Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Parcel } from "../models/Parcel";
import { useAppDispatch } from "../hooks";
import { setActiveParcel } from "../actions/parcelsSlice";

import LAND_IMG from "../assets/images/SampleLandImage.png";
import { BuyParcel, ViewParcel } from ".";

interface Props {
  parcel: Parcel;
  injectedProvider: any;
}

export default function ParcelDetail({ parcel, injectedProvider }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div className="parcel-detail">
      {/* HEADER */}
      <div className="parcel-detail-header flex justify-between items-center">
        <div className="flex justify-start">
          <span className="parcel-title primary-font text-lg font-medium leading-6 mr-4">
            Parcel #{"0".repeat(4 - (parcel.id.toString().length ?? 0))}
            {parcel.id}
          </span>
          <span className="parcel-price secondary-font text-base font-light text-gray-9 leading-6">
            {parcel?.price && `(${parcel.price.toString()} ETH)`}
          </span>
        </div>
        <a onClick={() => dispatch(setActiveParcel(undefined))}>
          <CloseOutlined style={{ fontSize: 20 }} />
        </a>
      </div>
      <Divider />

      <div className="flex flex-col space-y-4 primary-font text-lg">
        <img src={LAND_IMG} alt={parcel?.id.toString()} />
        {parcel?.sold ? (
          <ViewParcel parcel={parcel} />
        ) : (
          <BuyParcel parcel={parcel} injectedProvider={injectedProvider} />
        )}

        <div className="border-gray-4 text-left">
          <div className="p-4 text-white">Properties</div>
          <Divider />
          <div className="flex flex-col justify-between p-4">
            {parcel.sqft && parcel.acres && (
              <div className="py-2 secondary-font text-base font-light text-gray-9">
                Size: {parcel.sqft && `${parcel.sqft} Sqft`} {parcel.acres && `${parcel.acres} Acres`}
              </div>
            )}
            {parcel.location && (
              <div className="py-2 secondary-font text-base font-light text-gray-9">Location: {parcel.location}</div>
            )}
            {parcel.coordinates && (
              <div className="py-2 secondary-font text-base font-light text-gray-9">
                Coordinates:
                <br />
                {parcel.coordinates}
              </div>
            )}
            {/* Fallback text */}
            {!parcel.sqft && !parcel.acres && !parcel.location && !parcel.coordinates && (
              <div className="py-2 secondary-font text-base font-light text-gray-9">
                No parcel properties available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
