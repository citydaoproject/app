import React, { useRef, useEffect, useState, Ref } from "react";
import * as mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

import { Parcel } from "../models/Parcel";
import { BigNumber } from "@ethersproject/bignumber";
import { useAppSelector } from "../hooks";

(mapboxgl as any).accessToken =
  "pk.eyJ1IjoiZ3JlZ3JvbHdlcyIsImEiOiJja3J1cnhvbWEwMGQxMnZ0NjJ4OW80emZ6In0.XPrRJMSMXwdIC6k83O4lew";

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
  buyParcel: (id: number) => void;
}

export default function ParcelMap({ parcels, startingCoordinates, startingZoom, buyParcel }: Props) {
  const mapContainer = useRef(null);
  const map: Ref<mapboxgl.Map> = useRef(null);
  const [activeParcel, setActiveParcel] = useState("-1");

  const highlightedParcel = useAppSelector(state => state.parcels.highlightedParcel);

  const addParcelToMap = (geojson: any, string_id: string) => {
    if (map?.current) {
      map.current.addSource(string_id, {
        type: "geojson",
        data: geojson,
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

  const clickParcel = (parcel_id: string) => {
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
          const id = parcel.id.toString(); // convert big number id to string
          try {
            if (map.current && map.current.getSource(id)) return; // skip if already added
            addParcelToMap(parcel.geojson, id);
            // set click functionality
            map.current &&
              map.current.on("click", id, function (e) {
                clickParcel(parcel.id.toString());
              });
          } catch (e) {
            console.log(e);
          }
        });
      });
    }
  });

  useEffect(() => {
    for (let parcel of parcels) {
      if (highlightedParcel?.id === parcel.id && map?.current) {
        map.current.addLayer({
          id: parcel.id.toString(),
          source: parcel.id.toString(),
          type: "fill",
          paint: {
            "fill-color": "#eff551",
            "fill-opacity": 0.5,
            "fill-outline-color": "#eff551",
          },
        });
      } else if (map?.current && map.current.getLayer(parcel.id.toString())) {
        map.current.removeLayer(parcel.id.toString());
      }
    }
  });

  return (
    <div className="flex-grow flex flex-col">
      <div style={{ display: parcels.length > 0 ? "none" : "block", margin: "20px", textAlign: "center" }}>
        Retrieving parcels...
      </div>
      <div style={{ display: parcels.length > 0 ? "block" : "none", margin: "20px", textAlign: "center" }}>
        Selected parcel: {activeParcel ? activeParcel.toString() : null}
      </div>
      <button onClick={() => (activeParcel ? buyParcel(parseInt(activeParcel)) : null)}>BUY</button>
      <div ref={mapContainer} className="flex-grow" />
    </div>
  );
}
