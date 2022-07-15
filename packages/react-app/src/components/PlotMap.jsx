import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import loading from "../assets/images/loading.gif";
import CityDAO from "../assets/images/citydao.png";
import "mapbox-gl/dist/mapbox-gl.css";

import { useAppSelector, useAppDispatch } from "../hooks";
import { AnimatePresence, motion } from "framer-motion";
import { stringifyPlotId } from "../helpers/stringifyPlotId";
import { plotsList, drainageData, roadData, entranceGateData, edgeData, launchpadData } from "../data";
import { setActivePlot, setHighlightedPlot, setIdFilter } from "../actions/plotsSlice";
import Icon2 from "../assets/images/icon2.png";
import Icon3 from "../assets/images/icon3.png";
import PlotsStatus from "./PlotsStatus";
import { PLOT_IMAGES_BASE_URI } from "../constants";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function PlotMap({ startingCoordinates, startingZoom, startingPitch }) {
  const dispatch = useAppDispatch();
  const mapContainer = useRef(null);
  const map = useRef(null);
  let popup = new mapboxgl.Popup({
    maxWidth: "unset",
    closeButton: false,
    closeOnClick: false,
  });
  const lunchadPadPopup = new mapboxgl.Popup({
    maxWidth: "unset",
    closeButton: false,
    closeOnClick: false,
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const highlightedPlot = useAppSelector(state => state.plots.highlightedPlot);
  const activePlot = useAppSelector(state => state.plots.activePlot);
  const idFilter = useAppSelector(state => state.plots.idFilter);
  const [newPlots] = useState(plotsList);
  const [drainage] = useState(drainageData);
  const [road] = useState(roadData);
  const [entranceGate] = useState(entranceGateData);
  const [edge] = useState(edgeData);

  let highlightedPlotId = -1;

  const handleSetActivePlot = plot => {
    dispatch(setActivePlot(plot));
    if (!plot) {
      closePopup();
      dispatch(setIdFilter(""));
    }
  };

  useEffect(() => {
    if (idFilter != "") {
      let plotData = plotsList.features;
      let filteredPlot = [];
      filteredPlot = plotData.filter(plot => {
        return stringifyPlotId(plot.id).includes(idFilter);
      });
      handleSetActivePlot(filteredPlot[0]);
      return;
    }
    handleSetActivePlot(undefined);
  }, [idFilter]);

  //remove popups
  const closePopup = () => {
    const popups = document.getElementsByClassName("mapboxgl-popup");
    if (popups.length) {
      popups[0].remove();
    }
  };

  // zoom to plot on selection
  useEffect(() => {
    if (map.current && activePlot) {
      map.current.flyTo({
        center: activePlot.geometry.coordinates[0][0][0],
        pitch: startingPitch,
      });

      closePopup();
      const plotImageUrl = `${PLOT_IMAGES_BASE_URI}/${activePlot.id}.png`;

      //Create html content for popup
      let popupTitle = `<div class="flex items-center mb-2.5"><p class="text-primary-3 secondary-font text-lg">Plot #${stringifyPlotId(
        activePlot.id,
      )}</p>`;
      popupTitle += "<span class='primary-font text-base cursor-pointer absolute right-2.5' id='close-popup'>X</span>";
      popupTitle += `</div>`;
      let popupContent = "<div class='popup-content'><div class='cordinates'>";
      let coordinates = activePlot.geometry.coordinates[0][0];
      popupContent += "</div>";
      popupContent += `<img class="bg-transparent plot-image" src=${plotImageUrl} alt="Land" />`;
      popupContent += "</div>";

      const lats = coordinates.map(codinate => codinate[0]);
      const lngs = coordinates.map(codinate => codinate[1]);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      popup
        .setLngLat([centerLat, centerLng])
        .setHTML(popupTitle + popupContent)
        .addTo(map.current);
      document.getElementById("close-popup").addEventListener("click", () => handleSetActivePlot(undefined));
    }
  }, [activePlot]);

  const addOutlineToMap = (geojson, string_id, width = 1, opacity = 0.5, color = "#eff551") => {
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
          "line-width": width,
          "line-opacity": opacity,
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
    if (map?.current && highlightedPlot && !map.current.getLayer("highlighted_outline") && mapLoaded) {
      addOutlineToMap(highlightedPlot, "highlighted", 2, 0.5, "#00cf6b");
      addFilledToMap(activePlot, "highlighted", 0.5, "#00FFA8");
    } else if (map?.current && map.current.getLayer("highlighted_outline") && mapLoaded) {
      map.current.removeLayer("highlighted_fill");
      map.current.removeLayer("highlighted_outline");
      map.current.removeSource("highlighted");
    }
  }, [highlightedPlot, map.current]);

  // Add/remove plot highlight when acitve plot changes
  useEffect(() => {
    if (map?.current && activePlot && !map.current.getLayer("active_fill") && mapLoaded) {
      addOutlineToMap(activePlot, "active", 1, 0.5, "#00cf6b");
      addFilledToMap(activePlot, "active", 0.5, "#00FFA8");
    } else if (map?.current && map.current.getLayer("active_fill") && mapLoaded) {
      map.current.removeLayer("active_fill");
      map.current.removeLayer("active_outline");
      map.current.removeSource("active");
    }
  }, [activePlot, map.current]);

  //Add new plots on map after map loaded and set function for clicking on map
  useEffect(() => {
    if (map?.current && newPlots) {
      map.current.on("load", function () {
        if (!map.current.getLayer("parcel_outline")) {
          addOutlineToMap(newPlots, "parcel", 1, 0.5, "#00ffaa");
        }
        if (!map.current.getLayer(`parcel_fill`)) {
          addFilledToMap(newPlots, "parcel", 0, "#eff551");
        }
        if (!map.current.getLayer("road_outline")) {
          addOutlineToMap(road, "road", 1, 1, "#E0E371");
        }
        if (!map.current.getLayer("edge_outline")) {
          addOutlineToMap(edge, "edge", 2, 1, "#FFFFFF");
        }
        if (!map.current.getLayer("launchpad_outline")) {
          addOutlineToMap(launchpadData, "launchpad", 1, 1, "#E0E371");
        }
        if (!map.current.getLayer("launchpad_fill")) {
          addFilledToMap(launchpadData, "launchpad", 0, "#E0E371");
        }
        if (!map.current.getLayer("entrance_fill")) {
          addFilledToMap(entranceGate, "entrance", 0, "#E0E371");
        }

        map.current.loadImage(CityDAO, (error, image) => {
          if (error) throw error;

          // Add the image to the map style.
          if (map.current.hasImage("citydao")) return;
          map.current.addImage("citydao", image);

          // Add a data source containing one point feature.
          map.current.addSource("point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [-109.25998739898205, 44.924363970512005],
                  },
                },
              ],
            },
          });

          // Add a layer to use the image to represent the data.
          map.current.addLayer({
            id: "points",
            type: "symbol",
            source: "point", // reference the data source
            layout: {
              "icon-image": "citydao", // reference the image
              "icon-size": 0.5,
            },
          });
        });

        setTimeout(() => {
          setMapLoaded(true);

          // When the user enter the mouse into parcel_fill layer, we'll update the
          // cursor pointer
          map.current.on("mouseenter", "parcel_fill", () => {
            map.current.getCanvas().style.cursor = "pointer";
          });
          // When the user leave parcel_fill layer, we'll update the
          // cursor pointer
          map.current.on("mouseleave", "parcel_fill", () => {
            map.current.getCanvas().style.cursor = "";
            dispatch(setHighlightedPlot(undefined));
          });

          // When the user moves their mouse over the parcel_fill layer, we'll update the
          // highlighted plot state
          map.current.on("mousemove", "parcel_fill", e => {
            if (e.features.length > 0) {
              const hoveredFeature = e.features[0];
              let filteredPlot = [];

              //Filter plot list by hovered plot id
              filteredPlot = newPlots.features.filter(plot => {
                return plot.id == hoveredFeature.id;
              });

              //Return if highlighted plot is same with hovered plot
              if (highlightedPlotId == hoveredFeature.id) {
                return;
              }
              //Set highlighted plot
              highlightedPlotId = hoveredFeature.id;
              dispatch(setHighlightedPlot(undefined));
              dispatch(setHighlightedPlot(filteredPlot[0]));
            }
          });

          // When the user click plot on map, we'll update the
          // selected plot state
          map.current.on("click", "parcel_fill", e => {
            const clickedFeature = e.features[0];
            let filteredPlot = [];
            //Filter plot list by hovered plot id
            filteredPlot = newPlots.features.filter(plot => {
              return plot.id == clickedFeature.id;
            });
            //Set active plot
            handleSetActivePlot(filteredPlot[0]);
          });

          map.current.on("mouseenter", "launchpad_fill", e => {
            // Change the cursor style as a UI indicator.
            map.current.getCanvas().style.cursor = "pointer";

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates[0];
            let popupTitle = `<div class="flex flex-col items-start launchpad-popup"><img class="bg-transparent plot-image my-2" src=${Icon2} alt="Land" />`;
            popupTitle += `<p class="secondary-font text-base my-1">LFG Landing</p>`;
            popupTitle +=
              "<p class='primary-font text-xs text-white text-opacity-75 my-1 text-left'>Lorem ipsum dolor sit amet, consectetur</p>";
            popupTitle += `</div>`;

            const lats = coordinates.map(codinate => codinate[0]);
            const lngs = coordinates.map(codinate => codinate[1]);
            const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
            const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

            // Populate the popup and set its coordinates
            // based on the feature found.
            lunchadPadPopup.setLngLat([centerLat, centerLng]).setHTML(popupTitle).addTo(map.current);
          });
          map.current.on("mouseleave", "launchpad_fill", () => {
            map.current.getCanvas().style.cursor = "";
            lunchadPadPopup.remove();
          });
          map.current.on("mouseenter", "entrance_fill", e => {
            // Change the cursor style as a UI indicator.
            map.current.getCanvas().style.cursor = "pointer";

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates[0];
            let popupTitle = `<div class="flex flex-col items-start launchpad-popup"><img class="bg-transparent plot-image my-2" src=${Icon3} alt="Degentrance" />`;
            popupTitle += `<p class="secondary-font text-base my-1">Degentrance</p>`;
            popupTitle +=
              "<p class='primary-font text-xs text-white text-opacity-75 my-1 text-left'>Lorem ipsum dolor sit amet, consectetur</p>";
            popupTitle += `</div>`;

            const lats = coordinates.map(codinate => codinate[0]);
            const lngs = coordinates.map(codinate => codinate[1]);
            const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
            const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

            // Populate the popup and set its coordinates
            // based on the feature found.
            lunchadPadPopup.setLngLat([centerLat, centerLng]).setHTML(popupTitle).addTo(map.current);
          });
          map.current.on("mouseleave", "entrance_fill", () => {
            map.current.getCanvas().style.cursor = "";
            lunchadPadPopup.remove();
          });
        }, 1000);
      });
    }
  }, [newPlots, map.current]);

  return (
    <div className="plot-map flex-grow flex flex-col relative bg-gray-1 border-r">
      <AnimatePresence>{!mapLoaded && <Loading />}</AnimatePresence>
      <div ref={mapContainer} className="absolute left-0 right-0 top-0 bottom-0" />
      <PlotsStatus acres={40} plots={newPlots.features.length} />
    </div>
  );
}

function Loading() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black absolute left-0 right-0 top-0 bottom-0 z-10 flex items-center justify-center"
    >
      <img src={loading} alt="loading" />
    </motion.div>
  );
}
