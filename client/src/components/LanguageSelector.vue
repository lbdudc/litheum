<template>
  <v-tooltip left open-delay="200" color="#1976d2">
    <template v-slot:activator="{ on: onMenu, attrs }">
      <v-menu
        offset-y
        :close-on-content-click="true"
        transition="slide-y-transition"
        v-model="isMenuOpen"
        v-on="onMenu"
        v-bind="attrs"
      >
        <template v-slot:activator="{ on: onTooltip, attrs }">
          <v-btn
            color="white"
            v-bind="attrs"
            class="mt-3"
            v-on="{ ...onMenu, ...onTooltip }"
            @click="isMenuOpen = !isMenuOpen"
            ><v-icon>mdi-translate</v-icon></v-btn
          >
        </template>
        <v-container class="pa-0 white">
          <v-list>
            <v-list-item
              v-for="(entry, index) in languages"
              :key="index"
              @click="changeLocale(entry.language)"
            >
              <v-list-item-title>{{ entry.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-container>
      </v-menu>
    </template>
    <span>{{ $t("menu.language") }}</span>
  </v-tooltip>
</template>
<script>
export default {
  name: "LanguageSelector",
  data() {
    return {
      languages: [
        { flag: "uk", language: "EN", title: "English" },
        { flag: "es", language: "ES", title: "Español" },
        { flag: "gl", language: "GL", title: "Galego" },
      ],
      isMenuOpen: false,
    };
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
    },
  },
};
</script>
