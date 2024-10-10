import { getStyle } from "@/components/map-viewer/common/map-styles-common";
import styles from "@/components/map-viewer/config-files/styles.json";

const highlightedGeomStyle = { weight: 4, color: "white" };

const recalcGeomStyle = {
  fillOpacity: 0.7,
  weight: 2,
  fillColor: "lightBlue",
  color: "#2583c8",
};

const greyStyle = {
  fillColor: "#808080",
  color: "#808080",
  fillOpacity: 0.3,
  weight: 1.5,
};

function _getStyleByInterval(intervals, layer, consumptionSelector) {
  const val = layer.feature.properties[consumptionSelector];
  const interval = intervals.find(
    (el) => el.maxValue >= val && el.minValue <= val
  );
  return interval.style;
}

export function setDefaultStyle(
  leafletLayer,
  consumptionSelector,
  intervalValues,
  setBorderGrey
) {
  const styleName = _getStyleByInterval(
    intervalValues,
    leafletLayer,
    consumptionSelector
  );
  const expectedStyle = getStyle(
    styles,
    styleName,
    setBorderGrey ? "lightGrey" : null
  );
  const style = {};
  style.color = expectedStyle.strokeColor;
  style.fillColor = expectedStyle.fillColor;
  style.weight = expectedStyle.weight;
  style.fillOpacity = expectedStyle.fillOpacity;

  leafletLayer.setStyle(style);
}

export function setRecalcStyle(leafletLayer) {
  leafletLayer.setStyle(recalcGeomStyle);
}

export function setHighlightedStyle(leafletLayer) {
  leafletLayer.setStyle(highlightedGeomStyle);
}

export function toggleRecalcSelected(
  layer,
  consumptionSelector,
  intervalValues,
  setBorderGrey
) {
  if (layer.feature.properties.isSelected) {
    setRecalcStyle(layer);
  } else {
    setDefaultStyle(layer, consumptionSelector, intervalValues, setBorderGrey);
  }
}

export function setGreyStyle(layer) {
  layer.setStyle(greyStyle);
}
