<template>
  <v-container v-if="intervalValues.length > 0" class="legend-wrapper">
    <v-row justify="center" class="mt-4" no-gutters>
      <v-col cols="11">
        <v-select
          append-icon="mdi-map-legend"
          :items="legendItems"
          v-model="selectedLayerType"
          :item-text="(el) => $t(el.label)"
          dense
          outlined
          @change="changeLegendIntervals"
        ></v-select>
      </v-col>
      <v-col id="info-icon" cols="1">
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
            {{ $t("legend.tooltip.static") }}<br />{{
              $t("legend.tooltip.dynamic")
            }}<br />
          </p>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-list class="mt-n2" style="margin: auto">
        <v-list-item
          v-for="(item, idx) in intervalValues"
          :key="idx"
          class="mt-n4 list-item"
        >
          <v-avatar
            class="rounded"
            :size="avatarSize"
            :color="getColor(item?.style ? item.style : item)"
          >
          </v-avatar>
          <span
            v-if="item?.maxValue == null && item?.minValue != null"
            class="ml-2 legend-text"
          >
            <b>{{ $n(item?.minValue) }}</b>
          </span>
          <span
            v-if="item?.maxValue != null && item?.minValue != null"
            class="ml-2 legend-text"
          >
            <b>{{ $n(item?.minValue) }} - {{ $n(item?.maxValue) }}</b>
            {{ $t(`legend.${metricUnit}`) }}
          </span>
          <span
            v-if="item?.maxValue == null && item?.minValue == null"
            class="ml-2 legend-text"
          >
            {{ $t(`legend.no-data`) }}
          </span>
        </v-list-item>
      </v-list>
    </v-row>
  </v-container>
</template>
<script>
import { getStyle } from "@/components/map-viewer/common/map-styles-common";
import styles from "@/components/map-viewer/config-files/styles";
import layers from "./config-files/layers.json";
import { getSelectedOverlay } from "@/components/map-viewer/overlay-layers/overlays-manager";
import { StaticIntervalsLayerStyle } from "@lbdudc/map-viewer";

export default {
  name: "LegendComponent",
  props: {
    avatarSize: {
      type: String,
      default: "20px",
    },
    property: {
      type: String,
      default: "",
    },
    metricUnit: {
      type: String,
      default: "",
    },
    intervals: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      intervalValues: [],
      legendItems: [
        {
          value: "static",
          label: "legend.items.static",
        },
        {
          value: "dynamic",
          label: "legend.items.dynamic",
        },
      ],
      selectedLayerType: "dynamic",
    };
  },
  watch: {
    intervals() {
      this.changeLegendIntervals(this.selectedLayerType);
    },
  },
  mounted() {
    this.changeLegendIntervals(this.selectedLayerType);
  },
  methods: {
    getColor(item) {
      if (item) {
        const opacity = item.fillOpacity > 0.7 ? item.fillOpacity : 0.7;
        const _opacity = Math.round(
          Math.min(Math.max(opacity || 1, 0), 1) * 255
        );
        return item.fillColor + _opacity.toString(16).toUpperCase();
      } else {
        return "#808080B3";
      }
    },
    changeLegendIntervals(newVal) {
      switch (newVal) {
        case "static":
          this.$emit("legend-style", "static");
          this.setStaticIntervals();
          break;
        case "dynamic":
          this.$emit("legend-style", "dynamic");
          this.setDynamicIntervals();
          break;
      }
    },
    setDynamicIntervals() {
      const stylesJson = JSON.parse(JSON.stringify(styles));
      const intervalStyles = this.intervals.map((interval) => ({
        minValue: interval.minValue,
        maxValue: interval.maxValue,
        style: getStyle(
          stylesJson,
          interval.style,
          !getSelectedOverlay().isPaginated ? "lightgrey" : null
        ),
      }));

      this.setIntervals(intervalStyles);
    },
    setStaticIntervals() {
      const currentLayer = layers.layers.filter(
        (l) => l.name == getSelectedOverlay().id
      )[0];
      const stylesJson = JSON.parse(JSON.stringify(styles));
      // by now using graypolygon as literal
      const intervalStyles = currentLayer.availableStyles
        ?.filter((el) => el != "grayPolygon")
        .map((availableStyleName) =>
          getStyle(
            stylesJson,
            availableStyleName,
            !currentLayer.paginated ? "lightgrey" : null
          )
        );
      this.setIntervals(
        intervalStyles
          .filter((el) => el.property == this.property)
          .map((el) => el.intervals)[0]
      );
    },
    setIntervals(intervalStyles) {
      const stylesJson = JSON.parse(JSON.stringify(styles));
      const defaultStyle = [
        getStyle(
          stylesJson,
          "grayPolygon",
          !getSelectedOverlay().isPaginated ? "lightgrey" : null
        ),
      ];
      const style = new StaticIntervalsLayerStyle(
        "CustomStaticStyle",
        false,
        this.property,
        intervalStyles,
        defaultStyle[0]
      );
      this.intervalValues = style.getIntervals();
      this.$emit("update-styles", style);
    },
  },
};
</script>
<style lang="css" scoped>
.legend-text {
  font-size: 13px;
}

#info-icon {
  margin-top: 3px;
  padding-left: 2px;
}

.legend-wrapper {
  max-width: 205px;
  border: 2px solid;
  background-color: white;
  border-color: #135e9b96;
  border-collapse: collapse;
  height: min-content;
  margin-top: auto;
}
.list-item {
  padding: 0 !important;
  left: 50%;
  transform: translateX(-50%);
}
</style>
