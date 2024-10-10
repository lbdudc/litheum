import "leaflet";
import "leaflet/dist/leaflet.css";

import iconDefault from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import retinaUrl from "leaflet/dist/images/marker-icon-2x.png";

import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: retinaUrl,
  iconUrl: iconDefault,
  shadowUrl: iconShadow,
});

import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers/dist/js/leaflet.extra-markers";

import "leaflet-draw/dist/leaflet.draw";
import "leaflet-draw/dist/leaflet.draw.css";

import "leaflet.fullscreen/Control.FullScreen";
import "leaflet.fullscreen/Control.FullScreen.css";

import "leaflet-easybutton/src/easy-button";
import "leaflet-easybutton/src/easy-button.css";
import "Leaflet.MapCenterCoord/src/L.Control.MapCenterCoord";
import "Leaflet.MapCenterCoord/src/L.Control.MapCenterCoord.css";
import "leaflet-minimap/dist/Control.MiniMap.min";
import "leaflet-minimap/dist/Control.MiniMap.min.css";
import "leaflet-measure/dist/leaflet-measure";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-zoombox/L.Control.ZoomBox";
import "leaflet-zoombox/L.Control.ZoomBox.css";
import "leaflet.locatecontrol/src/L.Control.Locate";
import "leaflet.locatecontrol/src/L.Control.Locate.scss";
import "proj4/dist/proj4";
import "proj4leaflet/src/proj4leaflet";
