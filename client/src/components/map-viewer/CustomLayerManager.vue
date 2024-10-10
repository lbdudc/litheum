<template>
  <v-tooltip left open-delay="200" color="#1976d2">
    <template v-slot:activator="{ on: onMenu, attrs }">
      <v-menu
        offset-y
        :close-on-content-click="true"
        v-if="map"
        transition="slide-y-transition"
        v-model="isMenuOpen"
        v-on="onMenu"
        v-bind="attrs"
      >
        <template v-slot:activator="{ on: onTooltip, attrs }">
          <v-btn
            color="white"
            v-bind="attrs"
            v-on="{ ...onMenu, ...onTooltip }"
            @click="isMenuOpen = !isMenuOpen"
            ><v-icon>mdi-layers-triple</v-icon></v-btn
          >
        </template>
        <v-container class="pb-0 white">
          <v-radio-group v-model="selectedTileLayer">
            <v-radio
              v-for="layer in baseLayers"
              :key="layer.options.id"
              :label="layer.options.label"
              :value="layer.options.id"
            >
            </v-radio>
          </v-radio-group>
        </v-container>
      </v-menu>
    </template>
    <span>{{ $t("layerManager.title") }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    baseLayers: {
      type: Array,
      required: false,
    },
    map: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      selectedTileLayer: null,
      isMenuOpen: false,
    };
  },
  watch: {
    baseLayers: {
      handler(val) {
        if (val && val.length > 0) {
          this.selectedTileLayer = val.find(
            (el) => el.options.selected
          ).options.id;
        }
      },
      immediate: true,
    },
    selectedTileLayer(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.baseLayers.forEach((tileLayer) => {
          this.map.hideLayer(tileLayer);
        });
      }
      if (oldVal) {
        this.map.hideLayer(this.map.getLayer(oldVal));
      }
      if (newVal) {
        this.map.showLayer(this.map.getLayer(newVal));
      }
    },
  },
};
</script>

<style>
.layer-manager {
  margin-right: 12px;
  max-width: 250px;
}
</style>
