import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const localeEn = require.context("../locale/en", true, /\.json$/);
const localeEs = require.context("../locale/es", true, /\.json$/);
const localeGl = require.context("../locale/gl", true, /\.json$/);

const messages = {
  EN: {},
  ES: {},
  GL: {},
};

localeEn.keys().forEach((filename) => {
  Object.keys(localeEn(filename)).forEach((key) => {
    messages.EN[key] = localeEn(filename)[key];
  });
});
localeEs.keys().forEach((filename) => {
  Object.keys(localeEs(filename)).forEach((key) => {
    messages.ES[key] = localeEs(filename)[key];
  });
});
localeGl.keys().forEach((filename) => {
  Object.keys(localeGl(filename)).forEach((key) => {
    messages.GL[key] = localeGl(filename)[key];
  });
});

const i18n = new VueI18n({
  locale: localStorage.getItem("lang") || "EN", // set locale
  fallbackLocale: "EN", // set fallback locale
  messages, // set locale messages
});

export default i18n;
