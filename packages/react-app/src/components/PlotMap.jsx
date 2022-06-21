import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import loading from "../assets/images/loading.gif";
import "mapbox-gl/dist/mapbox-gl.css";

import { useAppSelector, useAppDispatch } from "../hooks";
import { AnimatePresence, motion } from "framer-motion";
import { stringifyPlotId } from "../helpers/stringifyPlotId";
import { plotsList } from "../data";
import { PARCEL_OPENSEA } from "../constants";
import { setActivePlot } from "../actions/plotsSlice";
import { sliceUserAddress } from "../helpers/sliceUserAddress";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function PlotMap({ startingCoordinates, startingZoom, startingPitch }) {
  const dispatch = useAppDispatch();
  const mapContainer = useRef(null);
  const map = useRef(null);
  let popup = new mapboxgl.Popup({
    maxWidth: "unset",
    closeButton: false,
    closeOnClick: false
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const highlightedPlot = useAppSelector(state => state.plots.highlightedPlot);
  const activePlot = useAppSelector(state => state.plots.activePlot);
  const communal = useAppSelector(state => state.plots.communal);
  const activePlotNftData = useAppSelector(state => state.plots.activePlotNftData);
  const [newPlots, setNewPlots] = useState(plotsList);

  // zoom to plot on selection
  useEffect(() => {
    if (map.current && activePlot) {
      map.current.flyTo({
        center: activePlot.geometry.coordinates[0][0][0],
        pitch: startingPitch,
      });

      let popupTitle = `<p class="plot-title">Plot #${stringifyPlotId(activePlot.id)}</p>`;
      let popupContent = "<div class='popup-content'><div class='cordinates'>";
      let coordinates = activePlot.geometry.coordinates[0][0];
      popupContent += "</div>";
      const openseaBtn = "<button class='view-plot-btn btn w-full' id='view_opensea'>View on Opensea</button>";
      popupContent += openseaBtn;
      if (activePlotNftData && activePlotNftData.owner && activePlotNftData.owner.address)
        popupContent += sliceUserAddress(activePlotNftData.owner.address);
      popupContent += "</div>";

      const lats = coordinates.map((codinate) => codinate[0]);
      const lngs = coordinates.map((codinate) => codinate[1]);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      popup.setLngLat([centerLat, centerLng]).setHTML(popupTitle + popupContent).addTo(map.current);
      document.getElementById('view_opensea').addEventListener('click', () => window.open(PARCEL_OPENSEA + activePlot.id, "_blank"));
    } else {
      const popups = document.getElementsByClassName("mapboxgl-popup");
      if (popups.length) {
        popups[0].remove();
      }
    }
  }, [activePlot]);

  const addOutlineToMap = (geojson, string_id, color = "#eff551") => {
    if (map?.current) {
      if (!map.current.getSource(string_id)) {
        map.current.addSource(string_id, {
          type: "geojson",
          data: geojson,
        });
      }
      // add plot outline
      map.current.addLayer({
        id: `${string_id}_outline`,
        source: string_id,
        type: "line",
        paint: {
          "line-color": color,
          "line-width": 1,
        },
      });
    }
  };

  const addFilledToMap = (geojson, string_id, opacity = 0.3, color = "#eff551") => {
    if (map?.current) {
      if (!map.current.getSource(string_id)) {
        map.current.addSource(string_id, {
          type: "geojson",
          data: geojson,
        });
      }
      // add plot outline
      map.current.addLayer({
        id: `${string_id}_fill`,
        source: string_id,
        type: "fill",
        paint: {
          "fill-color": color,
          "fill-opacity": opacity,
        },
      });
      
    }
  };

  useEffect(() => {
    if (map.current) return; // only render map once
    map.current = new mapboxgl.Map({
      container: mapContainer.current ?? "", // should never need the fallback
      style: "mapbox://styles/gregrolwes/ckvsro22d1bj514oy7iy900av",
      center: startingCoordinates,
      zoom: startingZoom,
      pitch: startingPitch,
    });
  }, []);

  // Add/remove plot highlight when highlighted plot changes
  useEffect(() => {
    if (map?.current && highlightedPlot && !map.current.getLayer("highlighted_fill") && mapLoaded) {
      addOutlineToMap(highlightedPlot, "highlighted", "#00cf6b");
      addFilledToMap(highlightedPlot, "highlighted", 0.5, "#00cf6b");
    } else if (map?.current && map.current.getLayer("highlighted_fill") && mapLoaded) {
      map.current.removeLayer("highlighted_fill");
      map.current.removeLayer("highlighted_outline");
      map.current.removeSource("highlighted");
    }
  }, [highlightedPlot, map.current]);

  //Add new plots on map after map loaded and set function for clicking on map
  useEffect(() => {
    if (map?.current && newPlots) {
      map.current.on("load", function () {
        console.log(newPlots)
        if (!map.current.getLayer("parcel_outline")) {
          addOutlineToMap(newPlots, "parcel", "#fff");
        }
        if (!map.current.getLayer(`parcel_fill`)) {
          addFilledToMap(newPlots, "parcel");
        }

        setTimeout(() => {
          setMapLoaded(true);
          map.current.on('mouseenter', 'parcel_fill', () => {
            map.current.getCanvas().style.cursor = 'pointer';
          });
          map.current.on('mouseleave', 'parcel_fill', () => {
            map.current.getCanvas().style.cursor = '';
          });
          map.current.on('click', 'parcel_fill', (e) => {
            const clickedFeature = e.features[0];
            let filteredPlot = [];
            filteredPlot = newPlots.features.filter(plot => {
              return plot.id == clickedFeature.id;
            })
            dispatch(setActivePlot(undefined));
            dispatch(setActivePlot(filteredPlot[0]));
          });
        }, 1000);
      });
    }
  }, [newPlots, map.current])

  return (
    <div className="plot-map flex-grow flex flex-col relative">
      <AnimatePresence>{!mapLoaded && <Loading />}</AnimatePresence>
      <div ref={mapContainer} className="absolute left-0 right-0 top-0 bottom-0 plot-map" />
    </div>
  );
}

function Loading() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="plot-map bg-black absolute left-0 right-0 top-0 bottom-0 z-10 flex items-center justify-center"
    >
      <img src={loading} alt="loading" />
    </motion.div>
  );
}
