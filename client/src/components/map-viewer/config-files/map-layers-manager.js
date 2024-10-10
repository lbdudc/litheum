import i18n from "@/plugins/i18n";
import { getStyle } from "@/components/map-viewer/common/map-styles-common";
import maps from "./maps.json";
import layers from "./layers.json";
import styles from "./styles.json";
import RepositoryFactory from "@/repositories/RepositoryFactory";
import { Map, TileLayer, WMSLayer, GeoJSONLayer } from "@lbdudc/map-viewer";
import properties from "@/properties";

function _getPropertyNameFromJSON(json) {
  // returns last substring after a '-'
  const prop = json.entityName != null ? "entityName" : "name";
  const nameParts = json[prop].split("-");
  return `${nameParts[0]}.json`;
}

function createMap(mapSelected) {
  let crs = L.CRS.EPSG3857;
  if (
    maps.maps[mapSelected].mapOptions &&
    maps.maps[mapSelected].mapOptions.crs
  ) {
    const crsOptions = maps.maps[mapSelected].mapOptions.crs;
    crs = new L.Proj.CRS(
      crsOptions.srid,
      crsOptions.proj4Config.params,
      crsOptions.proj4Config.options
    );
  }

  let mapOptions = { ...maps.maps[mapSelected].mapOptions };
  mapOptions.crs = crs;
  mapOptions.wheelPxPerZoomLevel = 60;
  mapOptions.zoomDelta = 1;

  const center = {
    lat: properties.LAT,
    lng: properties.LNG,
    zoom: properties.ZOOM,
  };
  return new Map("map", maps.maps[mapSelected].name, center, mapOptions);
}

function loadLeafletControls(map) {
  L.control.scale().addTo(map.getLeafletMap());
}

function loadBaseLayers(map, mapSelected) {
  let baseLayers = layers.layers.filter((layer) =>
    maps.maps[mapSelected].layers.find(
      (mapLayer) => mapLayer.name == layer.name && mapLayer.baseLayer
    )
  );
  const tilelayers = [];
  baseLayers
    .sort((a, b) => {
      return a.name - b.name;
    })
    .map((json) => {
      const baseLayerInMap = maps.maps[mapSelected].layers.find(
        (mapLayer) => mapLayer.name === json.name
      );
      return {
        id: json.name,
        label: i18n.t("mapViewer.layer-label." + json.name.replace(".", "-")),
        type: json.layerType,
        baseLayer: true,
        opacity: baseLayerInMap.opacity,
        selected: baseLayerInMap.selected === true,
        url: json.url || properties.GEOSERVER_URL + "/wms",
        params: json.options,
      };
    })
    .forEach((layerParams) => {
      let layer = null;
      if (layerParams.type === "tilelayer") {
        layer = new TileLayer(layerParams);
        map.addLayer(layer);
      } else if (layerParams.type === "wms") {
        layer = new WMSLayer(layerParams);
        map.addLayer(layer);
      }
      tilelayers.push(layer);
    });
  return tilelayers;
}

function loadOverlayLayers(map, mapSelected, popupFn, onFeatureClicked) {
  const layersToShow = layers.layers.filter((l) =>
    maps.maps[mapSelected].layers.find(
      (mapLayer) => !mapLayer.baseLayer && mapLayer.name === l.name
    )
  );
  const overlays = [];
  layersToShow
    .sort((a, b) => {
      const layerA = maps.maps[mapSelected].layers.find(
          (mapLayer) => mapLayer.name === a.name
        ),
        layerB = maps.maps[mapSelected].layers.find(
          (mapLayer) => mapLayer.name === b.name
        );
      return (
        (layerA.order != null ? layerA.order : 100) -
        (layerB.order != null ? layerB.order : 100)
      );
    })
    .forEach((json) => {
      const layerInMap = maps.maps[mapSelected].layers.find(
        (mapLayer) => mapLayer.name === json.name
      );
      const label = i18n.t(
        "mapViewer.layer-label." + json.name.replace(".", "-")
      );
      let availableStyles, defaultStyle;
      // Tilelayers hasn't got styles
      if (json.layerType !== "tilelayer") {
        // Get all available styles
        availableStyles = json.availableStyles?.map((availableStyleName) =>
          getStyle(styles, availableStyleName)
        );
        // Get default style
        defaultStyle =
          layerInMap.style != null
            ? availableStyles.find((style) => style.id === layerInMap.style)
            : json.defaultStyle != null
            ? availableStyles.find((style) => style.id === json.defaultStyle)
            : null;
      }

      let overlay = null;
      if (json.layerType === "wms") {
        const options = json.options;

        overlay = new WMSLayer(
          {
            id: json.name,
            label: label,
            baseLayer: false,
            selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
            list: layerInMap.list || json.list,
            url: json.url,
            params: options,
          },
          availableStyles,
          defaultStyle
        );
      } else if (json.layerType === "geojson") {
        const repository = RepositoryFactory.get(json.repository);
        const form = layerInMap.form || json.form;
        overlay = new GeoJSONLayer(
          repository.getGeom(_getPropertyNameFromJSON(json), {
            params: {
              properties: true,
            },
          }),
          {
            id: json.name,
            label: label,
            baseLayer: false,
            selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
            list: layerInMap.list || json.list,
            popup: popupFn(form, json.repository),
            click: (e) => onFeatureClicked(e.layer),
            minZoom: json.minZoom,
            maxZoom: json.maxZoom,
            paginated: json.paginated,
          },
          availableStyles,
          defaultStyle
        );
      } else if (json.layerType === "tilelayer") {
        overlay = new TileLayer({
          id: json.name,
          label: label,
          baseLayer: false,
          opacity: layerInMap.opacity,
          selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
          url: json.url,
          params: json.options,
        });
      }
      map.addLayer(overlay);
      overlays.push(overlay);
    });
  // override default zIndex set by mapviewer
  // leaflet draw works on zIndex 400
  map.getLeafletMap().getPane("celda-geom").style.zIndex = 300;
  map.getLeafletMap().getPane("edificio-geom").style.zIndex = 300;
  return overlays;
}

async function changeOverlay(map, overlays, newOverlay, oldOverlay) {
  return new Promise(async (resolve) => {
    const getLayerId = (el) => {
      return el.options.id;
    };

    const getOverlayLayers = (selected) =>
      overlays
        ?.filter((el) => {
          if (selected) {
            return selected.includes(getLayerId(el));
          } else {
            return getLayerId(el) === oldOverlay;
          }
        })
        .map((el) => map.getLayer(el.options.id));

    if (newOverlay != null) {
      await Promise.all(
        overlays.map((overlay) => {
          map.hideLayer(overlay);
        })
      );
    }
    if (oldOverlay != null) {
      const layers = getOverlayLayers(oldOverlay);
      if (layers != null)
        await Promise.all(
          layers.map((layer) => {
            map.hideLayer(layer);
          })
        );
    }
    if (newOverlay != null) {
      const layers = getOverlayLayers(newOverlay);
      if (layers != null)
        await Promise.all(
          layers.map((layer) => {
            map.showLayer(layer);
          })
        );
    }
    resolve();
  });
}

export {
  createMap,
  loadBaseLayers,
  loadOverlayLayers,
  changeOverlay,
  loadLeafletControls,
};
