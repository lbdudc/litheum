<template>
  <v-container fluid id="map-container">
    <div class="toggle_selected_view">
      <v-btn-toggle
        v-if="
          selectionModeFlag == 1 &&
          currentSelectionMode?.selectedGeometries &&
          Object.entries(currentSelectionMode.selectedGeometries).length > 0
        "
        mandatory
        v-model="selectedView"
        @change="onToggleSelectionView"
      >
        <v-btn> {{ $t("mapViewer.style-legend-label.view-all") }} </v-btn>

        <v-btn> {{ $t("mapViewer.style-legend-label.view-selected") }} </v-btn>
      </v-btn-toggle>
    </div>

    <v-slide-x-transition mode="out-in">
      <lateral-selectors
        v-if="showSelectors"
        ref="selectors"
        metricUnit="kWh/m2"
        hide-on-leave
        :selected-geometries="
          currentSelectionMode?.selectedGeometries
            ? currentSelectionMode?.selectedGeometries
            : {}
        "
        :initial-state="{
          selectionMode: selectionModeFlag,
          selectedIndicator: consumptionSelector,
          isGraphActive: isGraphActive,
          isActiveMode: isActiveMode,
          isDetailedMode: isDetailedMode,
        }"
        :selected-view="selectedView"
        :is-loading="loading"
        :selected-geom="currentSelectionMode?.selectedGeom"
        :has-graph="selectedOverlay?.isPaginated"
        :has-been-recalculated="mapHasBeenRecalculated"
        @selection-mode-change="onSelectionModeChange"
        @selector-change="(newVal) => (consumptionSelector = newVal)"
        @recalc="onRecalculate"
        @remove-geometries="onRemoveGeometries"
        @drawer-changed="
          (val) => (showSelectors = val ? showSelectors : !showSelectors)
        "
        @remove-selected="onRemoveRecalculate"
        @load-graph="onLoadGraphClick"
        @center-view="onCenterView"
        @reset-map="onResetMap"
        @active-mode="(newVal) => (isActiveMode = newVal)"
        @detailed-mode="(newVal) => (isDetailedMode = newVal)"
      ></lateral-selectors>
    </v-slide-x-transition>

    <div
      ref="map"
      id="map"
      :style="{ position: showSelectors ? 'relative' : 'fixed' }"
    ></div>

    <div v-if="loading" id="loading-div">
      <v-col>
        <v-row
          v-if="
            retrievedGeomValues == null ||
            (retrievedGeomValues != null && selectionModeFlag == 0)
          "
          justify="center"
        >
          <v-progress-circular
            color="primary"
            indeterminate
            size="50"
          ></v-progress-circular>
        </v-row>
        <v-row v-else justify="center">
          <v-progress-linear
            v-if="currentSelectionMode?.selectedGeometries"
            color="primary"
            :value="
              (retrievedGeomValues * 100) /
              Object.entries(currentSelectionMode.selectedGeometries).length
            "
            stream
            height="10"
            :style="{ width: '80%', margin: 'auto' }"
          ></v-progress-linear>
        </v-row>
        <v-row class="mt-8" justify="center">
          <span v-if="retrievedGeomValues == null"
            >{{ $t("mapViewer.loading") }}
          </span>
          <span
            v-if="
              retrievedGeomValues != null &&
              currentSelectionMode?.selectedGeometries
            "
            >{{ $t("mapViewer.loading-recalc") }}
          </span>
        </v-row>
      </v-col>
    </div>
    <div v-if="intervalValues[this.consumptionSelector]?.length > 0">
      <control-buttons
        ref="controlButtons"
        :base-layers="baseLayers"
        :consumption-selector="consumptionSelector"
        :map="map"
        :intervals="intervalValues[this.consumptionSelector]"
        :selected-geom="currentSelectionMode?.selectedGeom"
        :graph-active="isGraphActive"
        @polygon-selection="onPolygonSelection"
        @toggle-filters="onToggleFilters"
        @set-style="setCustomStyle"
        @toggle-buildings="onToggleBuildingView"
        @legend-change="(newVal) => (legendMode = newVal)"
        @close-graph="onCloseGraph"
      ></control-buttons>
    </div>
    <rating-dialog
      v-if="showRatingDialog"
      @close="onCloseRatingDialog"
    ></rating-dialog>
  </v-container>
</template>

<script>
import { default as jsonMaps } from "./config-files/maps.json";
import LateralSelectors from "./LateralSelectors.vue";
import ControlButtons from "./ControlButtons.vue";
import i18n from "@/plugins/i18n";
import {
  createMap,
  loadBaseLayers,
  loadOverlayLayers,
  loadLeafletControls,
} from "./config-files/map-layers-manager";
import {
  onMapZoomChange,
  changeOverlayView,
  manageLayerStyle,
} from "@/components/map-viewer/overlay-layers/overlays-manager";
import { checkForIntervalsValuesChange } from "./utils/utils";
import "@/assets/css/MapViewer.css";
import * as turf from "@turf/turf";
import { createInteractivitySetterAddon } from "@/components/map-viewer/common/map-layer-common";
import {
  initSelectionManager,
  setSelectionControllerByView,
} from "@/components/map-viewer/selection-utils/GeometrySelectionManager";
import RepositoryFactory from "@/repositories/RepositoryFactory";
import RatingDialog from "./lateral-bar/RatingDialog.vue";
const visitRepository = RepositoryFactory.get("VisitEntityRepository");

const maps = jsonMaps.maps.map((map, index) => {
  return {
    id: index,
    name: map.name,
    label: i18n.t("mapViewer.map-label." + map.name.replace(".", "-")),
  };
});
let customStyle = null;
let overlays = [];
let rectangleDrawer = null;

export default {
  name: "MapViewer",
  components: {
    "lateral-selectors": LateralSelectors,
    "control-buttons": ControlButtons,
    "rating-dialog": RatingDialog,
  },
  data() {
    return {
      map: null,
      baseLayers: [],
      selectedOverlay: null,
      consumptionSelector: "heating",
      loading: true,
      intervalValues: [],
      showSelectors: true,
      retrievedGeomValues: null,
      selectedGeom: null,
      selectedView: 0,
      selectionModeFlag: 0,
      legendMode: "dynamic",
      isGraphActive: false,
      currentSelectionMode: null,
      mapHasBeenRecalculated: false,
      showRatingDialog: false,
      isActiveMode: true,
      isDetailedMode: false,
    };
  },
  beforeDestroy() {
    this.destroyZoomEventListener();
    this.map.getLeafletMap().off("moveend", this.getData);
  },
  async mounted() {
    const hasVisited = JSON.parse(
      localStorage.getItem("hasVisited") || "false"
    );
    if (!hasVisited) {
      visitRepository
        .saveVisit()
        .then(() => localStorage.setItem("hasVisited", true));
    }
    this.showSelectors = !this.$vuetify.breakpoint.smAndDown;
    createInteractivitySetterAddon();
    this.loadMap();

    this.setZoomEventListener();
    this.buildRectangleDrawer();
  },
  methods: {
    setZoomEventListener() {
      this.map.getLeafletMap().on("zoomanim", this.onZoomEvent);
    },
    destroyZoomEventListener() {
      this.map.getLeafletMap().off("zoomanim", this.onZoomEvent);
    },
    async loadMap() {
      const selectedMap = maps[0].id;
      // We don't continue creating a map if there is no one selected
      if (selectedMap == null) {
        return;
      }
      // By default, if the user don't define his own CRS, we use the Leaflet's default
      this.map = createMap(selectedMap);
      this.map.getLeafletMap().doubleClickZoom.disable();

      this.baseLayers = loadBaseLayers(this.map, selectedMap);
      overlays = loadOverlayLayers(
        this.map,
        selectedMap,
        () => {},
        this.onGeometrySelected
      );
      loadLeafletControls(this.map);
      await this.onZoomEvent();
    },
    async getData() {
      const geometriesToMaintain = Object.assign(
        {},
        this.currentSelectionMode?.selectedGeometries
      );
      await this.selectedOverlay.getData(this.map, geometriesToMaintain);
      if (this.selectedOverlay.isPaginated) {
        this.updateIntervalStyles();
      }
    },
    async onGeometrySelected(layer) {
      await this.currentSelectionMode.onGeometrySelected(
        layer,
        this.selectedOverlay.repository,
        this.manageLayerStyleWrapper()
      );
    },
    onRemoveRecalculate(layer) {
      this.currentSelectionMode.onRemoveGeometry(
        layer,
        this.manageLayerStyleWrapper(),
        this.selectedOverlay.repository
      );

      if (
        Object.entries(this.currentSelectionMode?.selectedGeometries).length ==
        0
      ) {
        this.onToggleSelectionView(0);
      }
    },
    setCustomStyle(style) {
      customStyle = style;
      this.updateIntervalStyles();
    },
    updateIntervalStyles() {
      this.map
        .getVisibleOverlays()[0]
        ?.setCustomStyle(customStyle)
        .then(() => {
          if (
            Object.entries(this.currentSelectionMode?.selectedGeometries)
              .length > 0
          ) {
            this.onToggleSelectionView(this.selectedView);
          }
          this.loading = false;
        });
    },
    async onRecalculate(newValues) {
      setTimeout(() => {
        this.showRatingDialog = !JSON.parse(
          localStorage.getItem("hasRated") || "false"
        );
      }, 1000);
      this.loading = true;
      const results = [];
      this.retrievedGeomValues = 0;
      // if selected element is a legend limit its stored
      let overrideLimit = [];
      const properties = ["heating", "cooling", "lighting"];
      Object.entries(this.currentSelectionMode?.selectedGeometries).forEach(
        ([_, el]) => {
          properties.forEach((prop) => {
            const value = el.feature.properties[prop];
            const limits = this.intervalValues[this.consumptionSelector];
            if (
              limits[0].minValue == value ||
              limits[limits.length - 1].maxValue == value
            ) {
              overrideLimit.push(prop);
            }
          });
        }
      );

      const selectedList = Object.entries(
        this.currentSelectionMode?.selectedGeometries
      ).map(([_, geom]) => geom);
      const groups = [];
      for (let i = 0; i < selectedList.length; i += 50) {
        groups.push(selectedList.slice(i, i + 50));
      }
      const promises = groups.map((list) => {
        return new Promise(async (resolve) => {
          const data = await this.selectedOverlay.recalcGeomData({
            dimm: newValues.dimm,
            dimt: newValues.dimt,
            tipv: newValues.tipv,
            vent: newValues.vent,
            solar: newValues.solar,
            heatingTherm: newValues.heatingTherm,
            coolingTherm: newValues.coolingTherm,
            detailedMode: newValues.detailedMode,
            idList: list.map((geom) => geom.feature.id),
            activeMode: newValues.activeMode,
            refCatList: list.map((geom) => {
              return {
                refCat: geom.feature.properties.refCat,
                id: geom.feature.id,
              };
            }),
          });

          data.forEach((el) => {
            const geom = this.currentSelectionMode?.selectedGeometries[el.id];
            geom.feature.hasBeenRecalc = true;
            if (
              this.currentSelectionMode.selectedGeom?.layer.feature.id ==
              geom.feature.id
            ) {
              this.setNewPropertyValues(
                this.currentSelectionMode.selectedGeom.data,
                el
              );
              if (this.selectedOverlay.isPaginated) {
                const graphics = {
                  demand: el.demand,
                  radiation: el.radiation,
                };
                this.$set(
                  this.currentSelectionMode.selectedGeom,
                  "graphics",
                  graphics
                );
              }
            }

            this.setNewPropertyValues(geom.feature.properties, el);
            if (
              this.selectedOverlay.isPaginated &&
              this.currentSelectionMode.id == "individual"
            ) {
              geom.feature.graphics = {};
              geom.feature.graphics.radiation = el.radiation;
              geom.feature.graphics.demand = el.demand;
            }
            results.push(el);
            this.retrievedGeomValues = ++this.retrievedGeomValues;
          });

          resolve();
        });
      });

      Promise.all(promises)
        .then(async () => {
          this.retrievedGeomValues = null;
          this.intervalValues = await checkForIntervalsValuesChange(
            results,
            overrideLimit,
            this.map,
            JSON.parse(JSON.stringify(this.intervalValues))
          );
          this.selectedOverlay.intervalValues = this.intervalValues;
        })
        .catch(() => {
          setTimeout(() => {
            this.$notify({
              title: this.$t("errors.serverUnavailable.title"),
              text: this.$t("errors.serverUnavailable.content"),
              type: "error",
              duration: 5000,
              ignoreDuplicates: true,
            });
            this.loading = false;
          }, 500);
        });
      this.mapHasBeenRecalculated = true;
    },
    async onRemoveGeometries() {
      this.currentSelectionMode.removeAllGeometries();
      await this.map?.getVisibleOverlays()[0]?.setCustomStyle(customStyle);
    },
    setNewPropertyValues(geomData, newVals) {
      geomData.cooling = newVals.cooling;
      geomData.heating = newVals.heating;
      geomData.lighting = newVals.lighting;
    },
    onPolygonSelection(newVal) {
      this.map
        .getVisibleOverlays()[0]
        .getLayer()
        .then((l) => l.setInteractive(!newVal));
      if (newVal) {
        if (this.$refs.selectors) {
          this.$refs.selectors.onTabChange(1);
        } else {
          this.onSelectionModeChange(1);
        }
        rectangleDrawer.enable();
      } else {
        rectangleDrawer.disable();
      }
    },
    async onZoomEvent() {
      return new Promise(async (resolve) => {
        const newOverlay = await onMapZoomChange(this.map, overlays);
        if (newOverlay != null) {
          await this.$nextTick();
          this.loading = true;
          this.initNewOverlay(newOverlay);
        }
        resolve();
      });
    },
    async onToggleBuildingView(showBuildings) {
      if (showBuildings) {
        //change to building layout
        this.destroyZoomEventListener();
        const newOverlay = await changeOverlayView(
          "edificio-geom",
          this.map,
          overlays
        );
        this.loading = true;
        this.initNewOverlay(newOverlay);
      } else {
        this.setZoomEventListener();
        this.onZoomEvent();
      }
    },
    async initNewOverlay(newOverlay) {
      this.selectedOverlay = newOverlay;
      this.currentSelectionMode = initSelectionManager(this.selectionModeFlag);
      // remove previous level selection
      this.selectedView = 0;
      this.mapHasBeenRecalculated = false;
      await this.getData();
      this.intervalValues = newOverlay.intervalValues;
      const lmap = this.map.getLeafletMap();
      if (newOverlay.isPaginated) {
        lmap.on("moveend", this.getData);
      } else {
        lmap.off("moveend", this.getData);
      }
    },
    onToggleSelectionView(newView) {
      this.selectedView = newView;
      this.map
        .getVisibleOverlays()[0]
        .getLayer()
        .then((l) =>
          l.getLayers().forEach((leafletL) => {
            manageLayerStyle(
              this.selectedView,
              this.consumptionSelector,
              this.legendMode,
              this.selectionModeFlag,
              leafletL
            );
          })
        );
    },
    buildRectangleDrawer() {
      rectangleDrawer = new L.Draw.Polygon(this.map.getLeafletMap());
      this.map.getLeafletMap().on(
        L.Draw.Event.CREATED,
        function (e) {
          const layer = e.layer;
          const rectanglePolygon = L.polygon(layer.getLatLngs()); // Convierte los puntos de la capa a un polígono Leaflet
          const rectangleGeoJSON = rectanglePolygon.toGeoJSON(); // Convierte el polígono a formato GeoJSON

          this.map
            .getVisibleOverlays()[0]
            .getLayer()
            .then((l) => {
              l.eachLayer((leafletL) => {
                const leafletGeoJSON = leafletL.toGeoJSON(); // Convierte la capa a formato GeoJSON

                if (turf.booleanIntersects(rectangleGeoJSON, leafletGeoJSON)) {
                  this.currentSelectionMode.onGeometrySelectedGroupally(
                    leafletL,
                    this.manageLayerStyleWrapper()
                  );
                }
              });
              if (this.currentSelectionMode.selectedGeom.data == null) {
                this.currentSelectionMode.onCenterView(
                  Object.values(
                    this.currentSelectionMode.selectedGeometries
                  )[0],
                  this.manageLayerStyleWrapper(),
                  this.selectedOverlay.repository
                );
              }
            });
        }.bind(this)
      );
      this.map.getLeafletMap().on(
        L.Draw.Event.DRAWSTOP,
        function () {
          this.map
            .getVisibleOverlays()[0]
            .getLayer()
            .then((l) => l.setInteractive(true));
          rectangleDrawer.disable();
          this.$refs.controlButtons.selectionDisabled();
        }.bind(this)
      );
    },
    onLoadGraphClick(graphActive) {
      this.isGraphActive = graphActive;
    },
    onCenterView(layer) {
      this.currentSelectionMode.onCenterView(
        layer,
        this.manageLayerStyleWrapper(),
        this.selectedOverlay.repository
      );
      this.map.getLeafletMap().panTo(layer.getBounds().getCenter());
    },
    async onSelectionModeChange(newMode) {
      // reset the style before changing tab
      if (this.selectionModeFlag != newMode) {
        await this.map?.getVisibleOverlays()[0]?.setCustomStyle(customStyle);

        this.selectionModeFlag = newMode;
        this.currentSelectionMode = setSelectionControllerByView(
          this.selectionModeFlag,
          this.manageLayerStyleWrapper()
        );
      }
    },
    manageLayerStyleWrapper() {
      return manageLayerStyle.bind(
        null,
        this.selectedView,
        this.consumptionSelector,
        this.legendMode,
        this.selectionModeFlag
      );
    },
    onToggleFilters() {
      this.showSelectors = !this.showSelectors;
      this.$nextTick(() => this.map.getLeafletMap().invalidateSize());
    },
    async onResetMap() {
      this.loading = true;
      this.mapHasBeenRecalculated = false;
      const hideLayers = this.map
        .getLayers()
        .filter((el) => el.options.id == this.selectedOverlay.id)
        .map((el) => this.map.hideLayer(el));
      await Promise.all(hideLayers);
      overlays = loadOverlayLayers(
        this.map,
        maps[0].id,
        () => {},
        this.onGeometrySelected
      );
      overlays.forEach((ov) => this.map.addLayer(ov));
      this.currentSelectionMode = initSelectionManager(this.selectionModeFlag);
      const newOverlay = await changeOverlayView(
        this.selectedOverlay.id,
        this.map,
        overlays
      );
      this.initNewOverlay(newOverlay);
    },
    onCloseGraph() {
      this.$refs.selectors.onLoadGraphClick(false);
    },
    onCloseRatingDialog(rating) {
      if (rating != null) {
        localStorage.setItem("hasRated", true);
        visitRepository.saveRating({ rating: rating });
      }
      this.showRatingDialog = false;
    },
  },
};
</script>
<style lang="css" scoped>
#loading-div {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 101;
}

.toggle_selected_view {
  position: absolute;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 12px;
}
::v-deep .leaflet-marker-pane {
  z-index: 1000 !important;
}
</style>
