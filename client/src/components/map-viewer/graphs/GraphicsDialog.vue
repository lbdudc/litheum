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
            <v-col cols="12">
              <RecalculateDemand
                :cols="4"
                @submit-recalc="onRecalc"
              ></RecalculateDemand>
            </v-col>
          </div>
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
      const overlay = getSelectedOverlay();
      const result = await overlay.recalcGeomData({
        refCatList: [{ refCat: this.refCat, id: null }],
        dimm: newVals.dimm,
        dimt: newVals.dimt,
        tipv: newVals.tipv,
      });
      this.recalcDemand = result[0].demand;
      this.recalcRadiation = result[0].radiation;
      this.onGraphicChange(this.selectedGraph);
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
</style>
