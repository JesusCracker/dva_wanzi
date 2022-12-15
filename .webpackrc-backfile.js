export default {
  "entry": {
    "index": "./src/index.js",
    "vendor": [
      "react",
      "react-dom",
      "dva",
      "react-router",
      "prop-types"
    ]
  },

  "proxy": {
    "/api": {
      "target": "https://micro.wzkj.shop",
      "changeOrigin": true,
      "pathRewrite": { "^/api/" : "" }
    }
  },

  "extraBabelPlugins": [
    ["import", { "libraryName": "antd-mobile", "libraryDirectory": "es/components", "style": false}]
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ],
      "publicPath": "/"
    }
  },
  "manifest": {
    "basePath": "/"
  },
  "disableCSSModules": true,
  "hash":false,
  "ignoreMomentLocale":true,
  "publicPath": "/",
  "es5ImcompatibleVersions": true,
  "extraBabelIncludes":[
    "node_modules/@use-gesture",
    "node_modules/axios",
  ],
}
