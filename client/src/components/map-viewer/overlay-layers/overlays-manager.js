import OverlayFactory from "@/components/map-viewer/overlay-layers/OverlayFactory";
import { changeOverlay } from "../config-files/map-layers-manager";
import {
  setDefaultStyle,
  setRecalcStyle,
  setHighlightedStyle,
  setGreyStyle,
} from "./utils/style-utils";
import styles from "@/components/map-viewer/config-files/styles";

let currentOverlay = null;
export async function onMapZoomChange(map, overlays) {
  // timeout of 0 so zoom has the new value
  await sleep(0);
  const zoom = map.getLeafletMap().getZoom();
  let newOverlay = Object.entries(map.options.layers).find(
    ([_, el]) =>
      !el.options.baseLayer &&
      !el.options?.selected &&
      el.options?.minZoom <= zoom &&
      el.options?.maxZoom >= zoom
  );

  // if layer not selected and on zoom interval
  if (newOverlay != null) {
    currentOverlay = null;
    return setNewOverlay(map, overlays, newOverlay);
  } else {
    return null;
  }
}

export async function changeOverlayView(overlayName, map, overlays) {
  let newOverlay = Object.entries(map.options.layers).find(
    ([name, _]) => name === overlayName
  );

  return setNewOverlay(map, overlays, newOverlay);
}

async function setNewOverlay(map, overlays, newOverlay) {
  let oldOverlay = Object.entries(map.options.layers).find(
    ([_, el]) => !el.options.baseLayer && el.options?.selected
  );
  const newOverlayKey = newOverlay[0];
  await changeOverlay(
    map,
    overlays,
    newOverlayKey,
    oldOverlay != null ? oldOverlay[0] : null
  );
  const overlayConstructor = OverlayFactory.get(
    newOverlayKey.split("-")[0] + "overlay"
  );
  currentOverlay = new overlayConstructor(newOverlay[1]);

  await currentOverlay.fetchIntervalValues({ params: { intervalAmount: 7 } });
  if (currentOverlay.isPaginated) {
    await currentOverlay.fetchLayerBounds();
  }
  return currentOverlay;
}

export function getSelectedOverlay() {
  return currentOverlay;
}

/**
 *
 * @param {*} styleView when true only the selected geometries will be colored
 */
export function manageLayerStyle(
  styleView,
  consumptionSelector,
  legendMode,
  selectionMode,
  layer
) {
  let intervals = [];
  if (legendMode == "static") {
    const stylesJson = styles.styles.filter(
      (s) => s.name == consumptionSelector
    )[0];
    intervals = stylesJson.intervals;
  } else {
    intervals = currentOverlay.intervalValues[consumptionSelector];
  }

  if (selectionMode == 0) {
    if (layer.feature.properties.isHighlighted) {
      setHighlightedStyle(layer);
      layer.bringToFront();
    } else {
      setDefaultStyle(
        layer,
        consumptionSelector,
        intervals,
        !currentOverlay.isPaginated
      );
    }
    return;
  }

  // if every geom is colored
  if (styleView == 0) {
    if (layer.feature.properties.isSelected) {
      setRecalcStyle(layer);
    } else {
      setDefaultStyle(
        layer,
        consumptionSelector,
        intervals,
        !currentOverlay.isPaginated
      );
    }
  } else {
    // only color selected ones, the rest must be grey
    if (layer.feature.properties.isSelected) {
      setDefaultStyle(
        layer,
        consumptionSelector,
        intervals,
        !currentOverlay.isPaginated
      );
    } else {
      setGreyStyle(layer);
    }
  }
  if (layer.feature.properties.isLastSelected) {
    setHighlightedStyle(layer);
    layer.bringToFront();
  }
}

function sleep(timeout) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, timeout)
  );
}
