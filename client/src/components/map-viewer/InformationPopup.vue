<template>
  <v-container v-if="layer" fluid>
    <v-row>
      <v-simple-table class="mt-3" v-if="parsedFeature.length" dense>
        <template v-slot:default>
          <tbody class="popup-table">
            <tr v-for="prop in parsedFeature" :key="prop.key">
              <td>
                {{ $t(prop.key) }}
              </td>
              <td>
                {{ prop.value }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <span v-else style="min-width: 200px" class="result mt-6">{{
        $t("legend.no-data")
      }}</span>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "InformationPopup",
  props: {
    layer: {
      mandatory: true,
    },
    data: {
      mandatory: false,
    },
  },
  computed: {
    parsedFeature() {
      if (this.data == null) return [];
      const finalList = [];
      Object.keys(this.data).forEach((el) => {
        finalList.push({
          key: el,
          value: this.data[el],
        });
      });
      return finalList;
    },
  },
  updated() {
    if (this.layer) this.layer.updatePopup();
  },
};
</script>

<style scoped>
.link {
  font-size: 15px;
  cursor: pointer;
  display: inline-flex;
}
</style>
