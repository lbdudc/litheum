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
    <v-divider
      v-if="parsedFeature.length > 0 && hasGraph"
      class="mt-1"
    ></v-divider>
    <v-row
      v-if="parsedFeature.length > 0 && hasGraph"
      cols="12"
      class="mt-2 mb-2 mx-2"
    >
      <v-col cols="4">
        <div class="text-center d-flex flex-row align-center justify-center">
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
        <div class="ml-2">
          <span style="font-size: smaller">
            {{
              isDetailedMode
                ? $t("selectors.recalculate.detailed-mode-on")
                : $t("selectors.recalculate.detailed-mode-off")
            }}
          </span>
        </div>
      </v-col>
      <v-col style="text-align: center" cols="4">
        <div class="text-center mt-2 d-flex flex-column align-center">
          <v-tooltip right open-delay="200" color="#1976d2">
            <template v-slot:activator="{ on: attr, props }">
              <v-btn
                small
                v-bind:color="isGraphActive ? '#bde0ff' : 'white'"
                v-bind="props"
                v-on="attr"
                @click="$emit('load-graph', !isGraphActive)"
                class="mt-3"
              >
                <v-icon>mdi-chart-box-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("selectors.display.graph-tooltip") }}</span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="text-center d-flex flex-column align-center">
          <v-switch
            class="ml-4"
            v-model="isActiveMode"
            @change="(newVal) => $emit('active-mode', newVal)"
            inset
          ></v-switch>
          <span style="font-size: smaller">
            {{
              isActiveMode
                ? $t("selectors.recalculate.active-mode-on")
                : $t("selectors.recalculate.active-mode-off")
            }}
          </span>
        </div>
      </v-col>
    </v-row>
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
    showInfo: {
      type: Boolean,
      default: true,
    },
    initialState: {
      type: Object,
      mandatory: true,
    },
  },
  mounted() {
    this.isGraphActive = this.initialState.isGraphActive;
    this.isActiveMode = this.initialState.isActiveMode;
    this.isDetailedMode = this.initialState.isDetailedMode;
  },
  data() {
    return {
      isGraphActive: null,
      isActiveMode: null,
      isDetailedMode: null,
    };
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
