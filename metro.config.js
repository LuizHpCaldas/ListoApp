const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("db"); // Adicione esta linha se usar banco de dados local

module.exports = config;
