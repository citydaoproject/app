import React, { useRef, useEffect, useState, Ref } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

import { useAppSelector } from "../hooks";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function PlotMap({ parcel, plots, startingCoordinates, startingZoom, startingPitch }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const highlightedPlot = useAppSelector(state => state.plots.highlightedPlot);
  const activePlot = useAppSelector(state => state.plots.activePlot);

  // zoom to plot on selection
  useEffect(() => {
    if (map.current && activePlot) {
      map.current.flyTo({
        center: activePlot.metadata.geojson.geometry.coordinates[0][0],
        zoom: startingZoom,
        pitch: startingPitch,
      });
    }
  }, [activePlot]);

  const addPlotToMap = (geojson, string_id) => {
    if (map?.current) {
      map.current.addSource(string_id, {
        type: "geojson",
        data: geojson,
      });
      // add plot outline
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

  useEffect(() => {
    if (map.current) return; // only render map once
    map.current = new mapboxgl.Map({
      container: mapContainer.current ?? "", // should never need the fallback
      style: "mapbox://styles/gregrolwes/cksuzrjba5nsx17nkuv02r4rq",
      center: startingCoordinates,
      zoom: startingZoom,
      pitch: startingPitch,
    });
  }, []);

  // Draw initial plots
  useEffect(() => {
    if (map?.current) {
      map.current.on("load", function () {
        setMapLoaded(true);
        if (map.current && map.current.getSource("parcel")) return; // skip if already added
        addPlotToMap(parcel.metadata.geojson, "parcel");
      });
    }
  }, [map.current, plots]);

  // Add/remove plot highlight when highlighted plot changes
  useEffect(() => {
    if (map?.current && highlightedPlot && !map.current.getLayer("highlighted_fill") && mapLoaded) {
      addPlotToMap(highlightedPlot.metadata.geojson, "highlighted");
      map.current.addLayer({
        id: "highlighted_fill",
        source: "highlighted",
        type: "fill",
        paint: {
          "fill-color": "#eff551",
          "fill-opacity": 0.5,
          "fill-outline-color": "#eff551",
        },
      });
    } else if (map?.current && map.current.getLayer("highlighted_fill") && mapLoaded) {
      map.current.removeLayer("highlighted_fill");
      map.current.removeLayer("highlighted_outline");
      map.current.removeSource("highlighted");
    }
  }, [highlightedPlot, map.current]);

  return (
    <div className="flex-grow flex flex-col">
      <div ref={mapContainer} className="flex-grow plot-map" />
    </div>
  );
}
