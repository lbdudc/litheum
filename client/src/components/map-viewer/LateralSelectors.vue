<template>
  <v-navigation-drawer
    v-model="localDrawer"
    app
    clipped
    class="drawer"
    width="20%"
  >
    <a href="http://litheum.citic.udc.es">
      <div style="text-align: center">
        <img
          src="@/assets/LitheumLogo.png"
          class="pa-2"
          style="max-width: 55%"
        />
      </div>
    </a>
    <div>
      <v-tabs
        v-if="selectedView == 0 && tab != null"
        v-model="tab"
        centered
        fixed-tabs
        class="mb-2"
        @change="onTabChange"
      >
        <v-tab>
          {{ $t("selectors.indicators.individual") }}
        </v-tab>
        <v-tab> {{ $t("selectors.indicators.grupal") }} </v-tab>
      </v-tabs>
    </div>
    <v-row no-gutters align="center">
      <h3 class="section-title ml-2">
        {{ $t("selectors.indicators.title") }}
      </h3>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="section-title"
        @click="() => (showDemandSelector = !showDemandSelector)"
      >
        <v-icon v-if="showDemandSelector">expand_less</v-icon>
        <v-icon v-else>expand_more</v-icon>
      </v-btn>
      <v-col cols="12" v-show="showDemandSelector" class="mt-2">
        <v-select
          :label="$t('selectors.indicators.label')"
          :item-text="(el) => $t(el.label)"
          :item-value="(el) => el.value"
          :items="comsumptionSelector"
          outlined
          dense
          v-model="selectedIndicator"
          @change="(el) => onSelectorChange(el)"
        ></v-select>
        <div v-if="hasBeenRecalculated" style="text-align: center" class="mb-2">
          <v-btn @click="resetMap" small>{{
            $t("selectors.display.reset")
          }}</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div v-if="selectedView == 0">
      <v-row no-gutters align="center" class="mt-2">
        <h3 class="section-title ml-2">
          {{ $t("selectors.display.title") }}
        </h3>
        <v-spacer></v-spacer>
        <v-btn
          icon
          class="section-title"
          @click="() => (showInformationSelector = !showInformationSelector)"
        >
          <v-icon v-if="showInformationSelector">expand_less</v-icon>
          <v-icon v-else>expand_more</v-icon>
        </v-btn>
        <v-col cols="12" v-show="showInformationSelector">
          <div v-if="tab == 1">
            <StatisticsTable
              :selected-geometry="selectedGeom"
              :selected-geometries="selectedGeometries"
              :has-graph="hasGraph"
              @remove-geometries="onClearGeometries"
              @undo-selection="onUndoSelection"
            ></StatisticsTable>
          </div>
          <div v-else>
            <InformationTable
              :selected-geom="selectedGeom"
              :has-graph="hasGraph"
              :is-graph-active="isGraphActive"
              :show-info="tab == 0"
              @load-graph="onLoadGraphClick"
            ></InformationTable>
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <GeometriesList
        :geometries="selectedGeometries"
        :data="selectedGeom.data"
        @remove-selected="onRemoveGeometry"
        @center-view="onCenterView"
      ></GeometriesList>
    </div>
    <v-row class="mt-0 mb-2">
      <v-divider></v-divider>
    </v-row>
    <v-row no-gutters align="center" class="mt-2">
      <h3 class="section-title ml-2">
        {{ $t("selectors.recalculate.title") }}
      </h3>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="ml-2"
            v-bind="attrs"
            v-on="on"
            color="primary"
            small
            style="z-index: 3"
          >
            info
          </v-icon>
        </template>
        <p
          style="max-width: 500px"
          v-html="$t('selectors.recalculate.tooltip')"
        ></p>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="section-title"
        @click="() => (showRecalculate = !showRecalculate)"
      >
        <v-icon v-if="showRecalculate">expand_less</v-icon>
        <v-icon v-else>expand_more</v-icon>
      </v-btn>
      <v-col cols="12" v-show="showRecalculate">
        <RecalculateDemand
          :disable-selectors="
            tab == 1
              ? Object.entries(selectedGeometries).length == 0
              : selectedGeom == null
          "
          @submit-recalc="onSubmit"
        ></RecalculateDemand>
      </v-col>
    </v-row>
    <template v-slot:append>
      <div class="footer-wrapper">
        <img src="@/assets/footer.png" />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { comsumptionSelector } from "./utils/selectorsItems";
import StatisticsTable from "./lateral-bar/StatisticsTable.vue";
import RecalculateDemand from "./lateral-bar/RecalculateDemand.vue";
import GeometriesList from "./lateral-bar/GeometriesList.vue";
import InformationTable from "./lateral-bar/InformationTable.vue";

export default {
  name: "LateralSelectors",
  components: {
    StatisticsTable,
    RecalculateDemand,
    GeometriesList,
    InformationTable,
  },
  props: {
    selectedGeometries: {
      type: Object,
      mandatory: false,
    },
    initialState: {
      type: Object,
      mandatory: true,
    },
    selectedGeom: {
      type: Object,
      mandatory: false,
    },
    hasGraph: {
      type: Boolean,
      mandatory: false,
    },
    selectedView: {
      type: Number,
      mandatory: true,
    },
    hasBeenRecalculated: {
      type: Boolean,
      mandatory: false,
    },
  },
  data() {
    return {
      drawer: true,
      comsumptionSelector: comsumptionSelector,
      selectedIndicator: null,
      showDemandSelector: true,
      showRecalculate: true,
      isGraphActive: false,
      tab: null,
      showInformationSelector: true,
    };
  },
  mounted() {
    this.selectedIndicator = this.initialState.selectedIndicator;
    this.isGraphActive = this.initialState.isGraphActive;
    this.tab = this.initialState.selectionMode;
  },
  watch: {
    selectedGeom(newVal) {
      if (newVal == null) {
        this.onLoadGraphClick(false);
      }
    },
  },
  computed: {
    localDrawer: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.$emit("drawer-changed", val);
      },
    },
  },
  methods: {
    onSelectorChange(el) {
      this.$emit("selector-change", el);
    },
    onClearGeometries() {
      this.$emit("remove-geometries");
    },
    onRemoveGeometry(layer) {
      this.$emit("remove-selected", layer);
    },
    onLoadGraphClick(newVal) {
      this.isGraphActive = newVal;
      this.$emit("load-graph", this.isGraphActive);
    },
    onSubmit(obj) {
      this.$emit("recalc", obj);
    },
    onCenterView(layer) {
      this.$emit("center-view", layer);
    },
    onTabChange(newTab) {
      this.tab = newTab;
      if (this.tab == 1 && this.hasGraph) {
        this.onLoadGraphClick(false);
      }
      this.$emit("selection-mode-change", newTab);
    },
    onUndoSelection() {
      this.onRemoveGeometry(this.selectedGeom.layer);
    },
    resetMap() {
      this.$emit("reset-map");
    },
  },
};
</script>
<style scoped>
.page-title {
  display: flex;
  flex-direction: column;
}
.navigation-drawer {
  overflow: visible;
}
.hide-navigation-btn {
  border: 0;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  padding: 0 !important;
  width: 20px !important;
  height: 60px !important;
  min-width: 0 !important;
  cursor: pointer;
  border-left: 1px solid #dadce0;
  border-radius: 0 8px 8px 0;
  background: #fff 7px center/7px 10px no-repeat;
}
.hide-navigation-btn-container {
  visibility: visible;
  position: absolute;
  z-index: 0;
  display: block;
  top: calc(50% - 25px);
  left: 350px;
}

.drawer {
  height: 100%;
  left: 0;
}

@media only screen and (max-width: 1280px) {
  [class*="drawer"] {
    width: 80% !important;
  }
}

::v-deep .leaflet-top.leaflet-right {
  margin-top: 10px !important;
}

::v-deep .leaflet-top.leaflet-right .leaflet-control {
  margin-top: 0 !important;
}

.title {
  background-color: #1781eb !important;
  color: white;
  padding: 0.5em;
  height: 66px;
}

.section-title {
  color: #1781eb !important;
}

.footer-wrapper {
  display: flex;
  flex-direction: column;
  max-height: 10%;
}
</style>
