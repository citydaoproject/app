import React, { useRef, useEffect, useState, Ref } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

import { useAppDispatch, useAppSelector } from "../hooks";
import { setHighlightedPlot } from "../actions";
import { setActivePlot } from "../actions/plotsSlice";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function PlotMap({ plots, startingCoordinates, startingZoom, startingPitch }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const dispatch = useAppDispatch();
  const highlightedPlot = useAppSelector(state => state.plots.highlightedPlot);

  const addPlotToMap = (geojson, string_id) => {
    if (map?.current) {
      map.current.addSource(string_id, {
        type: "geojson",
        data: geojson,
      });
      // add plot click area
      map.current.addLayer({
        id: string_id,
        source: string_id,
        type: "fill",
        paint: {
          "fill-color": "#000000",
          "fill-opacity": 0,
        },
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

  const clickPlot = plot => {
    dispatch(setActivePlot(plot));
  };
  const hoverPlot = plot => {
    dispatch(setHighlightedPlot(plot));
  };
  const removeHoverPlot = () => {
    dispatch(setHighlightedPlot(undefined));
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
        plots.forEach(plot => {
          const id = plot.id.toString(); // convert big number id to string
          try {
            if (map.current && map.current.getSource(id)) return; // skip if already added
            addPlotToMap(plot.metadata.geojson, id);
            // set click functionality
            map.current &&
              map.current.on("click", id, function (e) {
                clickPlot(plot);
              });
            map.current &&
              map.current.on("mousemove", id, function (e) {
                hoverPlot(plot);
              });
            map.current &&
              map.current.on("mouseleave", id, function (e) {
                removeHoverPlot();
              });
          } catch (e) {
            console.log(e);
          }
        });
      });
    }
  }, [map.current, plots]);

  // Add/remove plot highlight when highlighted plot changes
  useEffect(() => {
    for (let plot of plots) {
      const fill_id = `${plot.id.toString()}_fill`;
      if (
        highlightedPlot?.id === plot.id &&
        map?.current &&
        !map.current.getLayer(fill_id) &&
        map.current.getSource(plot.id.toString())
      ) {
        map.current.addLayer({
          id: fill_id,
          source: plot.id.toString(),
          type: "fill",
          paint: {
            "fill-color": "#eff551",
            "fill-opacity": 0.5,
            "fill-outline-color": "#eff551",
          },
        });
      } else if (highlightedPlot?.id !== plot.id && map?.current && map.current.getLayer(fill_id)) {
        map.current.removeLayer(fill_id);
      }
    }
  }, [plots, highlightedPlot, map.current]);

  return (
    <div className="flex-grow flex flex-col">
      <div ref={mapContainer} className="flex-grow plot-map" />
    </div>
  );
}
