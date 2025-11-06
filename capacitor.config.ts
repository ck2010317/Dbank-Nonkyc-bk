import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.dbank.app",
  appName: "DBank",
  webDir: ".next",
  server: {
    url: "https://dbank.finance",
    androidScheme: "https",
    iosScheme: "https",
  },
  ios: {
    contentInset: "automatic",
  },
}

export default config
