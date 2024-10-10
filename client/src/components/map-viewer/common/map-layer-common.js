/**
 * Common functions to create and modify layers
 */
import properties from "@/properties";
import RepositoryFactory from "@/repositories/RepositoryFactory";
import { getStyle } from "@/components/map-viewer/common/map-styles-common";
import { GeoJSONLayer, WMSLayer } from "@lbdudc/map-viewer";

/**
 * Creates a WMS Layer.
 */
function createWMSLayer(json, layerParams, layerInMap = {}) {
  const options = json.options;

  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);

  return new WMSLayer(
    {
      id: json.name,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
      list: layerInMap.list || json.list || null,
      url: json.url || properties.GEOSERVER_URL + "/wms",
      params: options,
      added: layerParams.added,
    },
    availableStyles,
    defaultStyle
  );
}

/**
 * Creates a GeoJSON Layer.
 */
function createGeoJSONLayer(json, layerParams, layerInMap = {}) {
  const repository = RepositoryFactory.get(_getRepositoryNameFromJSON(json));

  const popup = layerParams.hasOwnProperty("popupFn")
    ? layerParams.popupFn(layerInMap.form || json.form)
    : null;
  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);
  const repositoryName = _getRepositoryNameFromJSON(json);
  const fileName = repositoryName.includes("Entity")
    ? _getEntityNameFromJSON(json)
    : _getPropertyNameFromJSON(json);

  return new GeoJSONLayer(
    repository.getGeom(fileName, {
      params: {
        properties: true,
      },
    }),
    {
      id: json.name,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
      list: layerInMap.list || json.list,
      url: json.url,
      popup: popup,
      added: layerParams.added,
    },
    availableStyles,
    defaultStyle
  );
}

function createInteractivitySetterAddon() {
  L.Layer.prototype.setInteractive = function (interactive) {
    if (this.getLayers) {
      this.getLayers().forEach((layer) => {
        layer.setInteractive(interactive);
      });
      return;
    }
    if (!this._path) {
      return;
    }

    this.options.interactive = interactive;

    if (interactive) {
      L.DomUtil.addClass(this._path, "leaflet-interactive");
    } else {
      L.DomUtil.removeClass(this._path, "leaflet-interactive");
    }
  };
}

function _getAvailableStyles(json) {
  return json.availableStyles?.map((availableStyleName) =>
    getStyle(availableStyleName)
  );
}

function _getDefaultStyle(json, availableStyles, layerInMap) {
  return layerInMap.style != null
    ? availableStyles.find((style) => style.id === layerInMap.style)
    : json.defaultStyle != null
    ? availableStyles.find((style) => style.id === json.defaultStyle)
    : null;
}

function _getEntityNameFromJSON(json) {
  const prop = json.entityName != null ? "entityName" : "name";
  const nameParts = json[prop].split("-");
  if (nameParts.length > 2) {
    return (
      nameParts[0] +
      "-" +
      nameParts[1].charAt(0).toUpperCase() +
      nameParts[1].slice(1)
    );
  }
  return nameParts[0];
}

function _getRepositoryNameFromJSON(json) {
  let entityName = _getEntityNameFromJSON(json);
  let repositorySuffix = "EntityRepository";
  // Check if component entity
  if (entityName.indexOf("-") != -1) {
    repositorySuffix = "Repository";
    entityName = entityName.replace("-", "");
  }
  return (
    entityName.charAt(0).toUpperCase() + entityName.slice(1) + repositorySuffix
  );
}

function _getPropertyNameFromJSON(json) {
  // returns last substring after a '-'
  const prop = json.entityName != null ? "entityName" : "name";
  const nameParts = json[prop].split("-");
  return nameParts[nameParts.length - 1];
}

export { createWMSLayer, createGeoJSONLayer, createInteractivitySetterAddon };
