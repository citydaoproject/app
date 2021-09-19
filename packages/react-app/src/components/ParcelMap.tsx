import React, { useRef, useEffect, useState, Ref } from "react";
import * as mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

import { Parcel } from "../models/Parcel";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setHighlightedParcel } from "../actions";

(mapboxgl as any).accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

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

  const dispatch = useAppDispatch();
  const highlightedParcel = useAppSelector(state => state.parcels.highlightedParcel);

  const addParcelToMap = (geojson: any, string_id: string) => {
    if (map?.current) {
      map.current.addSource(string_id, {
        type: "geojson",
        data: geojson,
      });
      // add parcel click area
      map.current.addLayer({
        id: string_id,
        source: string_id,
        type: "fill",
        paint: {
          "fill-color": "#000000",
          "fill-opacity": 0,
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

  const clickParcel = (parcel_id: string) => {
    setActiveParcel(parcel_id);
  };
  const hoverParcel = (parcel: Parcel) => {
    dispatch(setHighlightedParcel(parcel));
  };
  const removeHoverParcel = () => {
    dispatch(setHighlightedParcel(undefined));
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

  // Draw initial parcels
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
            map.current &&
              map.current.on("mousemove", id, function (e) {
                hoverParcel(parcel);
              });
            map.current &&
              map.current.on("mouseleave", id, function (e) {
                removeHoverParcel();
              });
          } catch (e) {
            console.log(e);
          }
        });
      });
    }
  });

  // Add/remove parcel highlight when highlighted parcel changes
  useEffect(() => {
    for (let parcel of parcels) {
      const fill_id = `${parcel.id.toString()}_fill`;
      if (highlightedParcel?.id === parcel.id && map?.current && !map.current.getLayer(fill_id)) {
        map.current.addLayer({
          id: fill_id,
          source: parcel.id.toString(),
          type: "fill",
          paint: {
            "fill-color": "#eff551",
            "fill-opacity": 0.5,
            "fill-outline-color": "#eff551",
          },
        });
      } else if (highlightedParcel?.id !== parcel.id && map?.current && map.current.getLayer(fill_id)) {
        map.current.removeLayer(fill_id);
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
