<template>
  <v-col cols="1">
    <v-dialog
      v-model="fullScreen"
      class="graph-dialog"
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card flex class="pa-0 ma-0">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="onFullScreenChange">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t("refCat") }}: {{ refCat }}</v-toolbar-title>
        </v-toolbar>
        <v-select
          append-icon="mdi-chart-box-outline"
          :items="graphicsOptions"
          v-model="selectedGraph"
          :item-text="(el) => $t(el.label)"
          dense
          outlined
          @change="onGraphicChange"
        ></v-select>
        <div id="graphic-container-fullscreen"></div>
        <div class="pa-2">
          <div style="display: flex; align-items: center">
            <h3 class="section-title ml-2">
              {{ $t("graphics.fullscreen.recalculate-title") }}
            </h3>
            <v-btn
              icon
              class="section-title"
              @click="() => (showRecalc = !showRecalc)"
            >
              <v-icon v-if="showRecalc">expand_less</v-icon>
              <v-icon v-else>expand_more</v-icon>
            </v-btn>
          </div>
          <div v-if="showRecalc">
            <div
              class="text-center d-flex flex-row align-center justify-center"
            >
              <div
                class="text-center d-flex flex-column align-center justify-center mr-10"
              >
                <div
                  class="text-center d-flex flex-row align-center justify-center"
                >
                  <v-switch
                    @change="(newVal) => $emit('detailed-mode', newVal)"
                    inset
                    v-model="isDetailedMode"
                  ></v-switch>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        class="mt-2 mr-2"
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                        small
                        style="z-index: 3"
                      >
                        info
                      </v-icon>
                    </template>
                    <p>
                      {{ $t("selectors.recalculate.warning-detailed") }}
                    </p>
                  </v-tooltip>
                </div>
                <span style="font-size: smaller">
                  {{
                    isDetailedMode
                      ? $t("selectors.recalculate.detailed-mode-on")
                      : $t("selectors.recalculate.detailed-mode-off")
                  }}
                </span>
              </div>
              <div class="text-center d-flex flex-column align-center">
                <v-switch class="ml-4" v-model="isActiveMode" inset></v-switch>
                <span style="font-size: smaller">
                  {{
                    isActiveMode
                      ? $t("selectors.recalculate.active-mode-on")
                      : $t("selectors.recalculate.active-mode-off")
                  }}
                </span>
              </div>
            </div>
            <RecalculateDemand
              :is-detailed-mode="isDetailedMode"
              :is-active-mode="isActiveMode"
              :cols="4"
              :rowCols="6"
              :is-edificio="true"
              :is-disabled-condition="true"
              @submit-recalc="onRecalc"
            ></RecalculateDemand>
          </div>
        </div>
        <div v-if="loading" id="loading-div-dialog">
          <v-col>
            <v-row justify="center">
              <v-progress-circular
                color="primary"
                indeterminate
                size="50"
              ></v-progress-circular>
            </v-row>
            <v-row class="mt-8" justify="center">
              <span>{{ $t("mapViewer.loading-recalc-graph") }} </span>
            </v-row>
          </v-col>
        </div>
      </v-card>
    </v-dialog>
    <v-tooltip bottom open-delay="200" color="#1976d2">
      <template v-slot:activator="{ on: onFullScreen, props }">
        <v-btn
          :disabled="disabled"
          icon
          @click="onFullScreenChange"
          v-on="onFullScreen"
          v-bind="props"
        >
          <v-icon>mdi-fullscreen</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("graphics.minimized.fullscreen-tooltip") }}</span>
    </v-tooltip>
  </v-col>
</template>
<script>
import graphSelectorOptions from "./graph-utils/graph-selector-options";
import { showDemandGraphic, showRadiationGraphic } from "./graph-utils/graph";

import { getSelectedOverlay } from "@/components/map-viewer/overlay-layers/overlays-manager.js";
import RecalculateDemand from "../lateral-bar/RecalculateDemand";

export default {
  data() {
    return {
      graphicsOptions: graphSelectorOptions,
      selectedGraph: "radiation",
      fullScreen: false,
      showRecalc: false,
      recalcDemand: null,
      recalcRadiation: null,
      isDetailedMode: false,
      isActiveMode: true,
      loading: false,
    };
  },
  components: { RecalculateDemand },
  props: {
    radiation: {
      type: Object,
      required: false,
    },
    demand: {
      type: Object,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    refCat: {
      type: String,
      required: false,
    },
    geomId: {
      type: Number,
      required: false,
    },
  },
  watch: {
    fullScreen(newVal) {
      if (newVal) {
        this.onGraphicChange(this.selectedGraph);
      } else {
        this.recalcDemand = null;
        this.recalcRadiation = null;
        this.showRecalc = false;
      }
    },
  },
  methods: {
    onGraphicChange(newVal) {
      const demand = this.recalcDemand ? this.recalcDemand : this.demand;
      const radiation = this.recalcRadiation
        ? this.recalcRadiation
        : this.radiation;

      switch (newVal) {
        case "demand":
          this.showDemandGraphic(demand);
          break;
        case "radiation":
          this.showRadiationGraphic(radiation);
          break;
      }
    },
    async showDemandGraphic(demand) {
      await this.$nextTick();
      this.plot = showDemandGraphic(
        "graphic-container-fullscreen",
        demand,
        true
      );
    },
    async showRadiationGraphic(radiation) {
      await this.$nextTick();
      this.plot = showRadiationGraphic(
        "graphic-container-fullscreen",
        radiation,
        true
      );
    },
    onFullScreenChange() {
      this.fullScreen = !this.fullScreen;
    },
    async onRecalc(newVals) {
      this.loading = true;
      const overlay = getSelectedOverlay();
      const result = await overlay.recalcGeomData({
        refCatList: [{ refCat: this.refCat, id: this.geomId }],
        dimm: newVals.dimm,
        dimt: newVals.dimt,
        tipv: newVals.tipv,
        vent: newVals.vent,
        solar: newVals.solar,
        heatingTherm: newVals.heatingTherm,
        coolingTherm: newVals.coolingTherm,
        detailedMode: this.isDetailedMode,
        activeMode: this.isActiveMode,
      });
      this.recalcDemand = result[0].demand;
      this.recalcRadiation = result[0].radiation;
      this.onGraphicChange(this.selectedGraph);
      this.loading = false;
    },
  },
};
</script>
<style scoped>
::v-deep .modebar-btn--logo {
  display: none !important;
}
.graph-dialog {
  z-index: 100;
}
.user-select-none {
  margin: auto !important;
}
#loading-div-dialog {
  position: absolute;
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
</style>
