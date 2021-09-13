import React, { useRef, useEffect, useState, Ref } from "react";
import * as mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

import { Parcel } from "../models/Parcel";
import { BigNumber } from "@ethersproject/bignumber";

(mapboxgl as any).accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

/*
  ~ What it does? ~

  Displays map with parcel overlays for each given geojson feature.

  ~ How can I use? ~

  <ParcelMap
    parcels={parcels}
    startingCoordinates={[-106.331, 43.172]}
    startingZoom={9}
  />

  ~ Features ~

  - Provide parcels={parcels}. parcels is an array of objects with id and geojson properties.
  - Provide startingCoordinates={[latitude, longitude]} for the maps starting position.
  - Provide startingZoom={9} as the maps beginning zoom level.
*/

interface Props {
  parcels: Parcel[];
  startingCoordinates: [number, number];
  startingZoom: number;
  buyParcel: (id: BigNumber) => void;
}

export default function ParcelMap({ parcels, startingCoordinates, startingZoom, buyParcel }: Props) {
  const mapContainer = useRef(null);
  const map: Ref<mapboxgl.Map> = useRef(null);
  const [activeParcel, setActiveParcel] = useState(BigNumber.from("-1"));

  const addParcelToMap = (geojson: any, string_id: string) => {
    if (map?.current) {
      map.current.addSource(string_id, {
        type: "geojson",
        data: geojson,
      });
      map.current.addLayer({
        id: string_id,
        source: string_id,
        type: "fill",
        paint: {
          "fill-color": "#eff551",
          "fill-opacity": 0.2,
          "fill-outline-color": "#eff551",
        },
      });
      // add parcel outline
      map.current.addLayer({
        id: `${string_id}_outline`,
        source: string_id,
        type: "line",
        paint: {
          "line-color": "#eff551",
          "line-width": 2,
        },
      });
    }
  };

  const clickParcel = (parcel_id: BigNumber) => {
    setActiveParcel(parcel_id);
  };

  useEffect(() => {
    if (map.current) return; // only render map once
    (map as any).current = new mapboxgl.Map({
      container: mapContainer.current ?? "", // should never need the fallback
      style: "mapbox://styles/gregrolwes/cksuzrjba5nsx17nkuv02r4rq",
      center: startingCoordinates,
      zoom: startingZoom,
    });
  });

  useEffect(() => {
    if (map?.current) {
      map.current.on("load", function () {
        parcels.forEach(parcel => {
          const id = parcel.id.toNumber().toString(); // convert big number id to string
          try {
            if (map.current && map.current.getSource(id)) return; // skip if already added
            addParcelToMap(parcel.geojson, id);
            // set click functionality
            map.current &&
              map.current.on("click", id, function (e) {
                clickParcel(parcel.id);
              });
          } catch (e) {
            console.log(e);
          }
        });
      });
    }
  });

  return (
    <div>
      <div style={{ display: parcels.length > 0 ? "none" : "block", margin: "20px", textAlign: "center" }}>
        Retrieving parcels...
      </div>
      <div style={{ display: parcels.length > 0 ? "block" : "none", margin: "20px", textAlign: "center" }}>
        Selected parcel: {activeParcel ? activeParcel.toNumber().toString() : null}
      </div>
      <button onClick={() => (activeParcel ? buyParcel(activeParcel) : null)}>BUY</button>
      <div ref={mapContainer} className="w-full h-screen" />
    </div>
  );
}
