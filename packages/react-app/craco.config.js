// craco.config.js
const CracoLessPlugin = require("craco-less");
module.exports = {
  babel: {
    loaderOptions: {
      ignore: ["mapbox-gl"],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#000000" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
