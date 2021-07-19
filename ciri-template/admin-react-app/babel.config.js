module.exports = {
  "presets": ["@babel/env", "@babel/react"],
  "plugins": [
    ["@babel/syntax-dynamic-import"],
    ["@babel/transform-runtime"],
    ["@babel/proposal-class-properties", { "spec": true }],
    ["@babel/proposal-object-rest-spread"]
  ]
}