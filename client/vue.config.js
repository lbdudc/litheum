module.exports = {
  devServer: {
    host: "localhost",
    public: process.env.VUE_APP_PUBLIC_URL,
    proxy: {
      "^/recalc": {
        target: process.env.VUE_APP_FLASK_SERVER_URL,
        changeOrigin: true,
      },
      "^/api/visitor": {
        target: process.env.VUE_APP_VISITS_SERVER_URL,
        changeOrigin: true,
      },
    },
  },
  // ...other vue-cli plugin options...
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      // we specify a custom service-worker in this route
      swSrc: "src/service-worker.js",
      // ...other Workbox options...
    },
  },
  publicPath: "/demo/",
  // Used to import .sld files when creating a custom SLD style
  chainWebpack: (config) => {
    config.module
      .rule("raw")
      .test(/\.sld$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  parallel: false,
};
