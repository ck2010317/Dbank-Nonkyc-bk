# DBank iOS App Setup Guide

This guide will help you build the DBank iOS application on your MacBook Pro.

## Prerequisites

1. **Xcode** (from Mac App Store - ~15GB download)
2. **Node.js** (installed via Homebrew)
3. **Command Line Tools**

## Step 1: Install Required Software

### Install Xcode
\`\`\`bash
# Open App Store and search for "Xcode"
# Click Get/Install and wait for completion
# Open Xcode once to accept license agreements
\`\`\`

### Install Command Line Tools
\`\`\`bash
xcode-select --install
\`\`\`

### Install Homebrew (if not installed)
\`\`\`bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
\`\`\`

### Install Node.js (if not installed)
\`\`\`bash
brew install node
\`\`\`

## Step 2: Clone and Setup Project

\`\`\`bash
# Clone your repository
git clone https://github.com/ck2010317/Dbank-Nonkyc-bk.git
cd Dbank-Nonkyc-bk

# Install dependencies
npm install
\`\`\`

## Step 3: Build for iOS

\`\`\`bash
# Build Next.js app
npm run build

# Add iOS platform (first time only)
npm run ios:add

# Sync files to iOS
npm run ios:build

# Open in Xcode
npm run ios:open
\`\`\`

## Step 4: Configure in Xcode

1. **Select Team:**
   - Click on project name in left sidebar
   - Go to "Signing & Capabilities" tab
   - Select your Apple Developer team (or add Apple ID for free tier)

2. **Update Bundle Identifier:**
   - Change from `com.dbank.finance` to something unique if needed
   - Example: `com.yourname.dbank`

3. **Select Device:**
   - Top toolbar: Choose simulator (iPhone 15) or your physical device
   - For physical device: Connect via USB and trust computer on iPhone

4. **Build and Run:**
   - Click Play button (▶️) or press Cmd+R
   - Wait for build to complete
   - App will launch on selected device

## Step 5: Test the App

The iOS app will connect to your live production API at `https://dbank.finance`. All functionality will work exactly like the web version.

## Common Issues

### "No Team Selected"
- Sign in with your Apple ID in Xcode preferences
- Or create free Apple Developer account

### "Build Failed"
- Clean build folder: Product → Clean Build Folder
- Restart Xcode
- Run `npm run ios:build` again

### "Provisioning Profile Error"
- Change bundle identifier to something unique
- Select "Automatically manage signing"

## Publishing to App Store

1. **Get Apple Developer Account** ($99/year)
2. **Create App in App Store Connect**
3. **Archive in Xcode:** Product → Archive
4. **Upload to App Store Connect**
5. **Submit for Review**

## Development vs Production

- **Development:** App connects to https://dbank.finance (production API)
- **Local Testing:** Change `server.url` in `capacitor.config.ts` to test locally

## Important Notes

- Website continues to work normally at https://dbank.finance
- iOS app is a wrapper around your web app
- All API calls go to your production server
- Database and authentication work seamlessly
- Push notifications and Face ID can be added later

## Next Steps

After successful build, you can add:
- Face ID authentication
- Push notifications
- Biometric login
- Native sharing features
- App icon and splash screens

Need help? Check Capacitor docs: https://capacitorjs.com/docs/ios
