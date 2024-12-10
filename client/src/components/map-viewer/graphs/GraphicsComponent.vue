<template>
  <v-container class="graphics-wrapper">
    <div class="pa-0 mr-0 d-flex" style="font-size: 12px">
      <span> {{ $t("refCat") }}: {{ geom.data.refCat }} </span>
      <div style="margin-left: auto">
        <v-tooltip bottom open-delay="200" color="#1976d2">
          <template v-slot:activator="{ on: onFullScreen, props }">
            <v-btn
              x-small
              icon
              v-on="onFullScreen"
              v-bind="props"
              @click="onCloseGraph"
              ><v-icon>mdi-close-circle-outline</v-icon></v-btn
            >
          </template>
          <span>{{ $t("graphics.minimized.close") }}</span>
        </v-tooltip>
      </div>
    </div>
    <v-row class="mt-1" justify="center" no-gutters>
      <graphics-dialog
        ref="graph-dialog"
        class="me-2"
        :disabled="loading"
        :demand="demand"
        :radiation="radiation"
        :refCat="geom.data.refCat"
        :geom-id="geom.data.id"
      ></graphics-dialog>
      <v-col cols="10">
        <v-select
          append-icon="mdi-chart-box-outline"
          :disabled="loading"
          :items="graphicsOptions"
          v-model="selectedGraph"
          :item-text="(el) => $t(el.label)"
          dense
          outlined
          @change="onGraphicChange"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="loading" class="loading-div" cols="12" no-gutters>
      <div class="d-flex flex-column">
        <v-progress-circular
          color="primary"
          indeterminate
          size="50"
          style="margin: auto"
        ></v-progress-circular>
        <span class="mt-3">{{ $t("graphics.minimized.loading") }} </span>
      </div>
    </v-row>
    <div id="graphic-container"></div>
    <v-row
      v-if="selectedGraph == 'radiation' && !loading"
      justify="center"
      no-gutters
      class="d-flex align-center mt-1"
    >
      <v-btn @click="onPrevMonth" small><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-btn @click="onNextMonth" small><v-icon>mdi-arrow-right</v-icon></v-btn>
    </v-row>
  </v-container>
</template>
<script src="plotly-locale-es.js"></script>
<script>
import Plotly from "plotly.js-dist";
import GraphicsDialog from "./GraphicsDialog.vue";
import graphSelectorOptions from "./graph-utils/graph-selector-options";
import { showDemandGraphic, showRadiationGraphic } from "./graph-utils/graph";
import { getSelectedOverlay } from "@/components/map-viewer/overlay-layers/overlays-manager";

export default {
  name: "GraphicsComponent",
  components: { "graphics-dialog": GraphicsDialog },
  props: {
    geom: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      plot: null,
      graphicsOptions: graphSelectorOptions,
      selectedGraph: "radiation",
      currentMonth: 0,
      fullScreen: false,
      demand: null,
      radiation: null,
      loading: false,
    };
  },
  mounted() {
    this.initGraphs();
  },
  watch: {
    geom() {
      Plotly.purge("graphic-container");
      this.initGraphs();
    },
    "$i18n.locale": function () {
      Plotly.purge("graphic-container");
      this.initGraphs();
    },
  },
  methods: {
    async initGraphs() {
      const currentOverlay = getSelectedOverlay();
      this.loading = true;
      if (this.geom?.graphics != null) {
        this.demand = this.geom.graphics.demand;
        this.radiation = this.geom.graphics.radiation;
      } else {
        const result = await currentOverlay.getGraphicsData(this.geom.data.id);
        this.demand = result.demand;
        this.radiation = result.radiation;
      }
      this.onGraphicChange(this.selectedGraph);
    },
    onGraphicChange(newVal) {
      switch (newVal) {
        case "demand":
          this.showDemandGraphic("graphic-container", false);
          break;
        case "radiation":
          this.showRadiationGraphic("graphic-container", false);
          break;
      }
      this.$refs["graph-dialog"].selectedGraph = newVal;
    },
    async showDemandGraphic() {
      this.plot = showDemandGraphic("graphic-container", this.demand, false);
      this.loading = false;
    },
    async showRadiationGraphic() {
      this.plot = showRadiationGraphic(
        "graphic-container",
        this.radiation,
        false,
        this.currentMonth
      );
      this.loading = false;
    },
    async onPrevMonth() {
      Plotly.purge("graphic-container");
      this.currentMonth == 0 ? (this.currentMonth = 11) : --this.currentMonth;
      this.showRadiationGraphic("graphic-container", false);
    },
    onNextMonth() {
      Plotly.purge("graphic-container");
      this.currentMonth == 11 ? (this.currentMonth = 0) : ++this.currentMonth;
      this.showRadiationGraphic("graphic-container", false);
    },
    onCloseGraph() {
      this.$emit("close-graph");
    },
  },
};
</script>
<style scoped>
.graphics-wrapper {
  border: 2px solid;
  background-color: white;
  border-color: #135e9b96;
  border-collapse: collapse;
  height: 100%;
  max-width: 350px;
  max-height: 450px;
}
.user-select-none {
  margin: auto !important;
}

.loading-div {
  position: relative;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 100;
  right: 0;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70%;
  text-align: center;
}
</style>
