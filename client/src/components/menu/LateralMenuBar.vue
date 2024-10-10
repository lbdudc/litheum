<template>
  <!-- Menú lateral -->
  <v-navigation-drawer v-model="localDrawer" app width="256px">
    <template v-slot:prepend>
      <v-list-item two-line :to="{ name: 'Home' }">
        <v-list-item-content>
          <v-list-item-title class="page-title">
            <span>LITHEUM</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-divider />

    <v-list dense>
      <v-list>
        <v-list-group v-model="menu" v-if="isInMapViewer">
          <template slot="activator">
            <v-list-item-content>
              <v-list-item-title>{{ $t("menu.name") }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <MenuListItems />
        </v-list-group>
        <MenuListItems v-else />
      </v-list>
    </v-list>

    <template v-slot:append>
      <LanguageSelector></LanguageSelector>
    </template>
  </v-navigation-drawer>
</template>

<script>
import LanguageSelector from "../LanguageSelector.vue";
import MenuListItems from "./MenuListItems.vue";

export default {
  name: "LateralMenuBar",
  data() {
    return {
      drawer: true,
      menu: false,
    };
  },
  components: {
    MenuListItems,
    LanguageSelector,
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
    isInMapViewer() {
      return this.$route.name === "MapViewer";
    },
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
    },
  },
};
</script>
<style scoped>
.page-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.7em;
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
</style>
