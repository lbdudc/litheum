import i18n from "@/plugins/i18n";

import {
  CategorizedLayerStyle,
  GeoJSONLayerStyle,
  StaticIntervalsLayerStyle,
  WMSLayerStyle,
} from "@lbdudc/map-viewer";

/**
 * Function to get the style parameters from the styles.json file from its name
 * @param styleName: style's name to find into styles.json file
 * @returns {*|null}: style parameters or null if it not found
 * @private
 */
function _getStyleParamsFromJSON(styles, styleName) {
  return JSON.parse(
    JSON.stringify(styles.styles.find((style) => style.name === styleName))
  );
}

/**
 * Function to get the instance of a style (of any type) from its name
 * @param styleName: style's name to find into styles.json file
 * @returns {GeoJSONLayerStyle|WMSLayerStyle|CategorizedLayerStyle|null}: if the style exists, returns the corresponding instance of the style
 */
function getStyle(styles, styleName, strokeColor) {
  const style = _getStyleParamsFromJSON(styles, styleName);
  if (style == null) {
    return null;
  } else if (style.type === "GeoJSONLayerStyle") {
    style.strokeColor = strokeColor != null ? strokeColor : style.strokeColor;
    return createGeoJSONStyle(style);
  } else if (style.type === "CategorizedStyle") {
    return createCategorizedStyle(styles, style);
  } else if (style.type === "StaticIntervalsStyle") {
    return createStaticIntervalsStyle(styles, style, strokeColor);
  }
  return null;
}

/* Creators to obtain the corresponding style instance from the style parameters received */

function createCategorizedStyle(styles, style) {
  let values = {};
  let valueTranslations = {};
  if (!style.cached) {
    for (const value in style.values) {
      values[value] = getStyle(styles, style.values[value]);
    }

    Object.keys(style.values).forEach((value) => {
      valueTranslations[value] = {};
      i18n.availableLocales.forEach(
        (l) =>
          (valueTranslations[value][l] =
            i18n.messages[l]["mapViewer"]["style-legend-label"][value])
      );
    });
  }
  return new CategorizedLayerStyle(
    style.name,
    style.cached,
    style.property,
    values,
    style.defaultStyle,
    valueTranslations
  );
}

function createStaticIntervalsStyle(styles, style, strokeColor) {
  let intervals = null;
  if (!style.cached) {
    intervals = JSON.parse(JSON.stringify(style.intervals));
    intervals.forEach((interval) => {
      interval.style = getStyle(styles, interval.style, strokeColor);
    });
  }
  return new StaticIntervalsLayerStyle(
    style.name,
    style.cached,
    style.property,
    intervals,
    getStyle(styles, style.defaultStyle)
  );
}

function createGeoJSONStyle(style) {
  return new GeoJSONLayerStyle(style.name, {
    fillColor: style.fillColor,
    strokeColor: style.strokeColor,
    fillOpacity: style.fillOpacity,
    strokeOpacity: style.strokeOpacity,
    weight: style.weight,
    radius: style.radius,
  });
}

export {
  getStyle,
  createGeoJSONStyle,
  createCategorizedStyle,
  createStaticIntervalsStyle,
};
