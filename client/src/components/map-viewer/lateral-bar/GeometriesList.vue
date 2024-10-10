<template>
  <div>
    <v-row no-gutters align="center">
      <h3 class="section-title ml-2">
        {{ $t("selected-geometries.title") }}
      </h3>
      <v-spacer></v-spacer>
      <v-btn icon class="section-title" @click="() => (showList = !showList)">
        <v-icon v-if="showList">expand_less</v-icon>
        <v-icon v-else>expand_more</v-icon>
      </v-btn>
    </v-row>
    <div style="max-height: 400px; overflow-y: auto">
      <v-list v-if="showList">
        <v-list-group
          v-for="(item, index) in geometriesList"
          :key="item.feature.id"
          :value="item.active"
          :id="'list-item-' + item.feature.id"
          @click="onViewGeom(item)"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                class="ml-4"
                v-text="
                  item.feature.properties.refCat
                    ? item.feature.properties.refCat
                    : item.feature.id
                "
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-btn @click="onDeleteGeom(item.feature.id)" x-small>
                {{ $t("selected-geometries.remove") }}
              </v-btn>
            </v-list-item-icon>
          </template>

          <v-list-item class="mt-1">
            <v-simple-table v-if="data" dense>
              <template v-slot:default>
                <tbody>
                  <tr v-for="prop in parsedData" :key="prop.key">
                    <td>
                      {{ $t(prop.key) }}
                    </td>
                    <td>
                      {{ !isNaN(prop.value) ? $n(prop.value) : prop.value }}
                      <span
                        style="font-size: smaller"
                        v-html="
                          $te(`${prop.key}_uds`) ? $t(`${prop.key}_uds`) : ''
                        "
                      ></span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-list-item>
          <v-divider
            v-if="index < geometriesList.length - 1"
            :key="index"
          ></v-divider>
        </v-list-group>
      </v-list>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    geometries: {
      type: Object,
      mandatory: null,
    },
    data: {
      type: Object,
      mandatory: false,
    },
  },
  data() {
    return { showList: true, parsedFeature: [] };
  },
  computed: {
    geometriesList: {
      cache: false,
      get() {
        return Object.values(this.geometries).map((el) => {
          el.active = el.feature.properties.isLastSelected;
          return el;
        });
      },
    },
    parsedData() {
      const finalList = [];
      if (this.data) {
        Object.keys(this.data).forEach((el) => {
          if (el != "id") {
            finalList.push({
              key: el,
              value: this.data[el],
            });
          }
        });
      }
      this.$nextTick(() =>
        document
          .getElementById(`list-item-${this.data.id}`)
          .scrollIntoView({ behavior: "smooth", block: "center" })
      );
      return finalList;
    },
  },
  methods: {
    onViewGeom(item) {
      this.$emit("center-view", item);
    },
    onDeleteGeom(key) {
      this.$emit("remove-selected", this.geometries[key]);
    },
  },
};
</script>
<style scoped>
.section-title {
  color: #1781eb !important;
}
::v-deep .v-list-group__header {
  padding-left: 5px !important;
}
</style>
