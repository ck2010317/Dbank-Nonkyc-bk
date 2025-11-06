# DBank iOS App Build Guide

## Prerequisites

1. **macOS** with Xcode installed
2. **Node.js** and npm installed
3. **Xcode Command Line Tools**: `xcode-select --install`

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Build the Web App

\`\`\`bash
npm run build
\`\`\`

### 3. Initialize Capacitor (First time only)

\`\`\`bash
npx cap add ios
\`\`\`

### 4. Sync Web Build to iOS

\`\`\`bash
npm run ios:build
\`\`\`

### 5. Open in Xcode

\`\`\`bash
npm run ios:open
\`\`\`

## Development Workflow

### Testing on Simulator

1. Build and sync: `npm run ios:build`
2. Open Xcode: `npm run ios:open`
3. Select a simulator (iPhone 15, etc.)
4. Click the Play button to run

### Testing on Physical Device

1. Connect your iPhone via USB
2. In Xcode, select your device from the device dropdown
3. Sign the app with your Apple Developer account:
   - Select the project in Xcode
   - Go to "Signing & Capabilities"
   - Select your Team
4. Click Play to install and run on your device

### Making Changes

After updating your Next.js code:

\`\`\`bash
npm run ios:build  # Rebuilds and syncs to iOS
\`\`\`

Then in Xcode, just click Play again to see changes.

## App Store Deployment

### 1. Configure App Information

In Xcode:
- Update Bundle Identifier: `com.dbank.app`
- Set Version and Build numbers
- Add App Icons (1024x1024 required)
- Add Launch Screen

### 2. Create App Store Connect Listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app
3. Fill in app information, screenshots, description

### 3. Archive and Upload

1. In Xcode: Product → Archive
2. Once archived, click "Distribute App"
3. Follow the wizard to upload to App Store Connect
4. Submit for review

## Troubleshooting

### Build Fails

- Clean build folder: Xcode → Product → Clean Build Folder
- Delete `ios` folder and run `npx cap add ios` again

### App Crashes on Launch

- Check Console in Xcode for error messages
- Ensure all environment variables are set correctly

### Changes Not Showing

- Make sure you ran `npm run ios:build` after code changes
- Clean and rebuild in Xcode

## Environment Variables

For iOS app, create a `.env.production` file with your production values:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
\`\`\`

These will be bundled into the app during build.

## Native Features

The app includes these Capacitor plugins:

- **App**: App state and info
- **Haptics**: Vibration feedback
- **Keyboard**: Keyboard control
- **Status Bar**: Status bar styling

To use them in your code:

\`\`\`typescript
import { Haptics } from '@capacitor/haptics';

// Trigger haptic feedback
await Haptics.impact({ style: 'light' });
\`\`\`

## Support

For issues, check:
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
\`\`\`

```plaintext file=".gitignore"
// ... existing code ...

# Capacitor
ios/App/Podfile.lock
ios/App/Pods
.DS_Store
