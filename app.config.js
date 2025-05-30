import "dotenv/config";

export default {
  expo: {
    name: "unimap",
    slug: "unimap",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "9f172688-1684-4e38-8ec6-2c0f064a48bd",
      },
      BACK_URL: process.env.BACK_URL,
      API_GOOGLE: process.env.API_GOOGLE,
    },
    updates: {
      url: "https://u.expo.dev/9f172688-1684-4e38-8ec6-2c0f064a48bd",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
