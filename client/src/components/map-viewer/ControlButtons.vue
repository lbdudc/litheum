<template>
  <div>
    <div class="control-buttons">
      <v-row>
        <v-btn
          color="white"
          max-height="25"
          max-width="20"
          @click.stop="showButtons = !showButtons"
        >
          <div v-if="!showButtons">
            <v-icon>mdi-wrench-outline</v-icon>
            <v-icon>mdi-chevron-down</v-icon>
          </div>
          <div v-else>
            <v-icon>mdi-wrench-outline</v-icon>
            <v-icon>mdi-chevron-up</v-icon>
          </div>
        </v-btn>
      </v-row>
      <div v-if="showButtons">
        <v-row class="mt-4">
          <custom-layer-manager
            :baseLayers="baseLayers"
            :map="map"
          ></custom-layer-manager>
        </v-row>
        <v-row>
          <v-tooltip left open-delay="200" color="#1976d2">
            <template v-slot:activator="{ on: onLegend, props }">
              <v-btn
                class="legend-btn mt-3"
                v-bind:color="showLegend ? '#d6d6d6' : 'white'"
                small
                @click="showLegend = !showLegend"
                v-bind="props"
                v-on="onLegend"
              >
                <v-icon>mdi-map-legend</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("legend.tooltip.btn") }}</span>
          </v-tooltip>
        </v-row>
        <v-row>
          <v-tooltip left open-delay="200" color="#1976d2">
            <template v-slot:activator="{ on: onFilters, attrs }">
              <v-btn
                class="mt-3"
                v-bind:color="filtersActive ? '#d6d6d6' : 'white'"
                @click="onToggleFilters"
                v-bind="attrs"
                v-on="onFilters"
              >
                <v-icon>mdi-filter</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("controlButtons.filters") }}</span>
          </v-tooltip>
        </v-row>
        <v-row>
          <v-tooltip left open-delay="200" color="#1976d2">
            <template v-slot:activator="{ on: onMultiple, attrs }">
              <v-btn
                class="mt-3"
                v-bind:color="selectionActive ? '#d6d6d6' : 'white'"
                @click="onPolygonSelection"
                v-bind="attrs"
                v-on="onMultiple"
              >
                <v-icon>mdi-crop-square</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("controlButtons.multiple") }}</span>
          </v-tooltip>
        </v-row>
        <v-row>
          <v-tooltip left open-delay="200" color="#1976d2">
            <template v-slot:activator="{ on: onMultiple, attrs }">
              <v-btn
                v-bind:color="showBuildings ? '#d6d6d6' : 'white'"
                class="mt-3"
                @click="onShowBuildings"
                v-bind="attrs"
                v-on="onMultiple"
              >
                <v-icon>mdi-office-building-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("controlButtons.show-buildings") }}</span>
          </v-tooltip>
        </v-row>
        <v-row>
          <language-selector></language-selector>
        </v-row>
        <v-row>
          <information-dialog></information-dialog>
        </v-row>
      </div>
    </div>
    <div class="floating-boxes">
      <legend-component
        :intervals="intervals"
        :style="{
          visibility: showLegend ? 'visible' : 'hidden',
          'pointer-events': 'auto',
        }"
        :property="consumptionSelector"
        metricUnit="kWh/m2"
        @update-styles="setCustomStyle"
        @legend-style="onLegendStyleChange"
      ></legend-component>
      <div>
        <graphics-component
          v-if="graphActive"
          class="ml-4"
          style="pointer-events: auto"
          :geom="selectedGeom"
          @close-graph="onCloseGraph"
        ></graphics-component>
      </div>
    </div>
  </div>
</template>
<script>
import CustomLayerManager from "./CustomLayerManager.vue";
import LegendComponent from "./LegendComponent.vue";
import GraphicsComponent from "./graphs/GraphicsComponent.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";
import InformationDialog from "./InformationDialog.vue";

export default {
  props: {
    baseLayers: {
      type: Array,
      required: false,
      default: () => [],
    },
    intervals: {
      type: Array,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
    consumptionSelector: {
      type: String,
      required: true,
    },
    selectedGeom: {
      type: Object,
      required: false,
    },
    graphActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showBuildings: false,
      showLegend: true,
      filtersActive: true,
      selectionActive: false,
      showButtons: true,
    };
  },
  mounted() {
    this.showLegend = !this.$vuetify.breakpoint.smAndDown;
  },
  components: {
    "custom-layer-manager": CustomLayerManager,
    "legend-component": LegendComponent,
    "graphics-component": GraphicsComponent,
    "language-selector": LanguageSelector,
    "information-dialog": InformationDialog,
  },
  methods: {
    onToggleFilters() {
      this.filtersActive = !this.filtersActive;
      this.$emit("toggle-filters");
    },
    setCustomStyle(style) {
      this.$emit("set-style", style);
    },
    onPolygonSelection() {
      this.selectionActive = !this.selectionActive;
      this.$emit("polygon-selection", this.selectionActive);
    },
    onShowBuildings() {
      this.showBuildings = !this.showBuildings;
      this.$emit("toggle-buildings", this.showBuildings);
    },
    onLegendStyleChange(newVal) {
      this.$emit("legend-change", newVal);
    },
    selectionDisabled() {
      this.selectionActive = false;
    },
    onCloseGraph() {
      this.$emit("close-graph");
    },
  },
};
</script>
<style lang="css" scoped>
.legend-btn {
  min-width: 64px !important;
  height: 36px !important;
}
.control-buttons {
  position: fixed;
  z-index: 5;
  top: 0;
  right: 0;
  margin-right: 2rem;
  margin-top: 2rem;
}
.floating-boxes {
  pointer-events: none;
  position: fixed;
  right: 1.5vw;
  z-index: 3;
  bottom: 20px;
  padding: 5px;
  display: flex;
}
</style>
