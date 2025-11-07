import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.dbank.finance",
  appName: "DBank",
  webDir: "out",
  server: {
    androidScheme: "https",
    iosScheme: "https",
    // For production, the app will connect to your live API
    url: "https://dbank.finance",
    cleartext: true,
  },
  ios: {
    contentInset: "always",
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#000000",
    },
  },
}

export default config
