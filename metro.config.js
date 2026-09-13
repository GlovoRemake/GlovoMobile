const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes("svg")) {
    config.resolver.assetExts.push("svg");
}

config.resolver.sourceExts = config.resolver.sourceExts.filter(
    (ext) => ext !== "svg"
);

module.exports = withNativeWind(config, {
    input: "./global.css",
    inlineRem: 16,
});