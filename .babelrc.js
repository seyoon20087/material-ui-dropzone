module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        targets: "defaults",
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: [
    "babel-plugin-optimize-clsx",
    // any package needs to declare 7.27.6 as a runtime dependency. default is ^7.0.0
    [
      "@babel/plugin-transform-runtime",
      {
        version: "^7.27.6",
      },
    ],
    // for IE 11 support
    "@babel/plugin-transform-object-assign",
    // material-ui 'productionPlugins'
    "@babel/plugin-transform-react-constant-elements",
    "babel-plugin-transform-dev-warning",
    [
      "babel-plugin-transform-react-remove-prop-types",
      {
        mode: "unsafe-wrap",
      },
    ],
    // END material-ui 'productionPlugins'
  ],
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
};
