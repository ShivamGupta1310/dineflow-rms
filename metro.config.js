const path = require("path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const projectRoot = __dirname;
const srcRoot = path.join(projectRoot, "src");

const defaultConfig = getDefaultConfig(__dirname);

const aliasToSrcSubdir = {
  "@components": "components",
  "@screens": "screens",
  "@assets": "assets",
  "@constants": "constants",
  "@theme": "theme",
  "@store": "store",
  "@navigation": "navigation",
  "@hooks": "hooks",
  "@utils": "utils",
  "@services": "services",
  "@localization": "localization",
  "@appTypes": "types",
  "@config": "config",
  "@models": "models",
};

const config = {
  transformer: {
    babelTransformerPath: require.resolve(
      "react-native-svg-transformer/react-native",
    ),
  },

  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),

    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],

    resolveRequest: (context, moduleName, platform) => {
      for (const [alias, subdir] of Object.entries(aliasToSrcSubdir)) {
        if (moduleName === alias) {
          return context.resolveRequest(
            context,
            path.join(srcRoot, subdir),
            platform,
          );
        }

        const prefix = `${alias}/`;
        if (moduleName.startsWith(prefix)) {
          const rest = moduleName.slice(prefix.length);
          return context.resolveRequest(
            context,
            path.join(srcRoot, subdir, rest),
            platform,
          );
        }
      }

      return context.resolveRequest(context, moduleName, platform);
    },
  },

  watchFolders: [srcRoot],
};

module.exports = mergeConfig(defaultConfig, config);
