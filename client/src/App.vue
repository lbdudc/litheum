<template>
  <v-app>
    <notifications :max="3" :width="300" position="top center" />
    <v-main>
      <router-view class="content">
        <!-- -->
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  mounted() {
    const navLang = window.navigator.language.split("-")[0].toUpperCase();
    if (this.$i18n.availableLocales.includes(navLang)) {
      this.$i18n.locale = navLang;
    }
  },
};
</script>
<style lang="css">
.notification-content {
  color: white !important;
}
.notification-title {
  color: white !important;
}
</style>
