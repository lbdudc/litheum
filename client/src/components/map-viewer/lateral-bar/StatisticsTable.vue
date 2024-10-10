<template>
  <div>
    <div v-if="parsedFeatureGroup">
      <v-simple-table dense class="mt-4" style="text-align: center">
        <template v-slot:default>
          <thead>
            <tr>
              <th>
                <v-label style="font-size: smaller"
                  >( {{ Object.entries(selectedGeometries).length }} /
                  200)</v-label
                >
              </th>
              <th class="text-left">
                {{ $t("selectors.indicators.heating") }}
              </th>
              <th class="text-left">
                {{ $t("selectors.indicators.cooling") }}
              </th>
              <th class="text-left">
                {{ $t("selectors.indicators.lighting") }}
              </th>
            </tr>
          </thead>
          <tbody class="popup-table">
            <tr
              v-for="key in Object.keys(parsedFeatureGroup['heating'])"
              :key="key"
              style="text-align: end"
            >
              <td>
                {{ $t(`selectors.display.${key}`) }}
              </td>
              <td>
                {{
                  $n(roundToTwoDecimals(parsedFeatureGroup["heating"][key]), {
                    minimumFractionDigits: 2,
                  })
                }}
              </td>
              <td>
                {{
                  $n(roundToTwoDecimals(parsedFeatureGroup["cooling"][key]), {
                    minimumFractionDigits: 2,
                  })
                }}
              </td>
              <td>
                {{
                  $n(roundToTwoDecimals(parsedFeatureGroup["lighting"][key]), {
                    minimumFractionDigits: 2,
                  })
                }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div style="display: flex; justify-content: center" class="mt-2 mb-2">
        <v-btn @click="$emit('remove-geometries')" small>{{
          $t("selectors.display.clear-button")
        }}</v-btn>
        <v-tooltip right open-delay="200" color="#1976d2">
          <template v-slot:activator="{ on: onDownloadTooltip, props }">
            <v-btn
              @click="onDownload"
              class="ml-2"
              small
              v-bind="props"
              v-on="onDownloadTooltip"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("selectors.display.download.btn-tooltip") }}</span>
        </v-tooltip>
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
            v-html="$t('selectors.display.download.info')"
          ></p>
        </v-tooltip>
      </div>
    </div>
    <v-alert v-else text dense class="mt-2" color="info">
      <v-row class="text-center" dense>
        <v-col cols="1">
          <v-icon color="primary" small> info </v-icon>
        </v-col>
        <v-col cols="11">
          {{ $t("selectors.display.group-info") }}
        </v-col>
      </v-row>
    </v-alert>
    <div v-if="selectedGeometry">
      <InformationTable
        :selected-geom="selectedGeometry"
        :has-graph="false"
        :show-info="false"
      ></InformationTable>
      <div style="text-align: center">
        <v-btn
          v-if="Object.entries(this.selectedGeometries).length >= 1"
          @click="onUndoSelection"
          class="mb-4 mt-2"
          style=""
        >
          {{ $t("selectors.display.undo-selection") }}
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import InformationTable from "./InformationTable.vue";
export default {
  props: {
    selectedGeometry: {
      type: Object,
      mandatory: false,
    },
    selectedGeometries: {
      type: Object,
      mandatory: false,
    },
  },
  components: {
    InformationTable,
  },
  computed: {
    parsedFeatureGroup() {
      const selectedTotal = Object.entries(this.selectedGeometries).length;
      if (selectedTotal > 1) {
        const statistics = {
          heating: { min: null, max: null, avg: 0, sum: 0 },
          cooling: { min: null, max: null, avg: 0, sum: 0 },
          lighting: { min: null, max: null, avg: 0, sum: 0 },
        };
        Object.keys(this.selectedGeometries).forEach((key) => {
          const { heating, cooling, lighting } =
            this.selectedGeometries[key].feature.properties;

          statistics.heating.sum += heating;
          statistics.cooling.sum += cooling;
          statistics.lighting.sum += lighting;

          statistics.heating.min =
            statistics.heating.min == null || heating < statistics.heating.min
              ? heating
              : statistics.heating.min;
          statistics.cooling.min =
            statistics.cooling.min == null || cooling < statistics.cooling.min
              ? cooling
              : statistics.cooling.min;
          statistics.lighting.min =
            statistics.lighting.min == null ||
            lighting < statistics.lighting.min
              ? lighting
              : statistics.lighting.min;

          statistics.heating.max =
            statistics.heating.max == null || heating > statistics.heating.max
              ? heating
              : statistics.heating.max;
          statistics.cooling.max =
            statistics.cooling.max == null || cooling > statistics.cooling.max
              ? cooling
              : statistics.cooling.max;
          statistics.lighting.max =
            statistics.lighting.max == null ||
            lighting > statistics.lighting.max
              ? lighting
              : statistics.lighting.max;
        });
        statistics.heating.avg = statistics.heating.sum / selectedTotal;
        statistics.cooling.avg = statistics.cooling.sum / selectedTotal;
        statistics.lighting.avg = statistics.lighting.sum / selectedTotal;
        return statistics;
      }
      return null;
    },
  },
  methods: {
    roundToTwoDecimals(val) {
      return Math.round((val + Number.EPSILON) * 100) / 100;
    },
    onUndoSelection() {
      this.$emit("undo-selection");
    },
    onDownload() {
      this.downLoadTable();
      this.downloadSelected();
    },
    downLoadTable() {
      const indicators = ["heating", "cooling", "lighting"];
      const displayProperties = ["min", "max", "avg", "sum"];
      const rows = [];
      for (const displayProperty of displayProperties) {
        const row = [this.$t(`selectors.display.${displayProperty}`)];
        for (const indicator of indicators) {
          row.push(this.parsedFeatureGroup[indicator][displayProperty]);
        }
        rows.push(row);
      }
      const headerRow = [
        "",
        ...indicators.map((indicator) =>
          this.$t(`selectors.indicators.${indicator}`)
        ),
      ];
      rows.unshift(headerRow);
      this.generateCsv(
        rows,
        this.$t("selectors.display.download.statistics-csv")
      );
    },
    downloadSelected() {
      const rows = [];
      let isBuilding = false;
      Object.keys(this.selectedGeometries).forEach((el) => {
        const props = this.selectedGeometries[el].feature.properties;
        isBuilding = props.refCat != null;
        rows.push([
          props.refCat ? props.refCat : props.id,
          props.heating,
          props.cooling,
          props.lighting,
        ]);
      });
      const header = [
        isBuilding ? this.$t("refCat") : "id",
        this.$t("selectors.indicators.heating"),
        this.$t("selectors.indicators.cooling"),
        this.$t("selectors.indicators.lighting"),
      ];
      rows.unshift(header);
      this.generateCsv(
        rows,
        this.$t("selectors.display.download.selection-csv")
      );
    },
    generateCsv(rows, title) {
      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${title}.csv`);
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>
