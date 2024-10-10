<template>
  <div>
    <div>
      <v-simple-table v-if="parsedFeature.length > 0" dense class="mt-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th style="font-size: medium">
                {{ $t("selectors.indicators.last-selected") }}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prop in parsedFeature" :key="prop.key">
              <td>
                {{ $t(prop.key) }}
              </td>
              <td>
                {{ !isNaN(prop.value) ? $n(prop.value) : prop.value }}
                <span
                  style="font-size: smaller"
                  v-html="$te(`${prop.key}_uds`) ? $t(`${prop.key}_uds`) : ''"
                ></span>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div v-else>
        <v-alert v-if="showInfo" text dense class="mt-2" color="info">
          <v-row class="text-center" dense>
            <v-col cols="1">
              <v-icon color="primary" small> info </v-icon>
            </v-col>
            <v-col cols="11">
              {{ $t("selectors.display.last-info") }}
            </v-col>
          </v-row>
        </v-alert>
      </div>
    </div>
    <div
      v-if="parsedFeature.length > 0 && hasGraph"
      class="d-flex flex-row mt-3 mb-3"
    >
      <div style="text-align: center" :style="{ margin: 'auto' }">
        <v-tooltip right open-delay="200" color="#1976d2">
          <template v-slot:activator="{ on: attr, props }">
            <v-btn
              class="ml-2"
              small
              v-bind:color="isGraphActive ? '#d6d6d6' : 'white'"
              v-bind="props"
              v-on="attr"
              @click="$emit('load-graph', !isGraphActive)"
            >
              <v-icon>mdi-chart-box-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("selectors.display.graph-tooltip") }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectedGeom: {
      type: Object,
      mandatory: false,
    },
    hasGraph: {
      type: Boolean,
      mandatory: false,
    },
    isGraphActive: {
      type: Boolean,
      mandatory: false,
    },
    showInfo: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    parsedFeature() {
      const finalList = [];
      if (this.selectedGeom?.data) {
        Object.keys(this.selectedGeom.data).forEach((el) => {
          if (el != "id") {
            finalList.push({
              key: el,
              value: this.selectedGeom.data[el],
            });
          }
        });
      }
      return finalList;
    },
  },
};
</script>
