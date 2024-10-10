<template>
  <v-list class="py-0 pl-1">
    <v-list-item :to="{ name: 'MapViewer', params: { id: 'map' } }">
      <v-list-item-title>
        {{ $t("menu.mapViewer") }}
      </v-list-item-title>
    </v-list-item>
    <v-list-group>
      <template slot="activator">
        <v-list-item-icon>
          <v-icon>list</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t("menu.lists") }}</v-list-item-title>
        </v-list-item-content>
      </template>
      <v-list class="py-0 pl-2" v-for="(item, index) in listItems" :key="index">
        <v-list-item :to="{ name: item.name }">
          <v-list-item-content>
            <v-list-item-title>{{ $t(item.label) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-list-group>
  </v-list>
</template>
<script>
export default {
  name: "MenuListItems",
  data() {
    return {
      listItems: [
        {
          name: "Celda List",
          label: "t_celda.headers.celdaList",
        },
        {
          name: "Edificio List",
          label: "t_edificio.headers.edificioList",
        },
      ],
      menu: false,
      lists: false,
    };
  },
  mounted() {
    window.addEventListener("load", () => this.$emit("bar-items-loaded"));
  },
  beforeDestroy() {
    window.removeEventListener("load", this.resizeHandler);
  },
  computed: {},
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
    },
  },
};
</script>
