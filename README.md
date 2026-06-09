# Choreo

An iOS app built with [Expo](https://expo.dev) / React Native.

## Development (Linux / NixOS)

This project uses a [Nix flake](https://nixos.wiki/wiki/Flakes) to provide a reproducible dev environment with Node.js and all required tooling. You do not need to install Node globally.

### Prerequisites

- [Nix](https://nixos.org) with flakes enabled
- [Expo Go](https://apps.apple.com/app/expo-go/id982107779) installed on your iPhone
- Your iPhone connected to the same [Tailscale](https://tailscale.com) network as this machine

### Enter the dev shell

```bash
nix develop
```

This drops you into a shell with `node`, `npx`, `expo`, and `qrencode` available.

### Install dependencies

```bash
npm install
```

### Start the dev server

#### Option A — with QR code sent to your phone (recommended)

```bash
./scripts/dev.sh
```

This will:
1. Start the Expo Metro bundler bound to the Tailscale hostname
2. After ~5 seconds, generate a QR code and send it to you via sapo notify
3. Open the notification on your iPhone, tap the QR code, and Expo Go will launch the app with live reload

#### Option B — terminal only

```bash
npm start
```

Prints the QR code in the terminal. Scan it with your iPhone camera (it opens Expo Go automatically) or with the Expo Go app's built-in scanner.

> **Note:** For Tailscale access, use `npm start -- --host nixos.tailee43b7.ts.net` so the QR encodes the correct address.

### Hot reload

Once connected, any file changes trigger an instant reload in Expo Go over the Tailscale connection. No rebuild needed.

---

## Building for the App Store

iOS builds require macOS (or a cloud Mac service). The recommended approach is [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

EAS Build runs the Xcode build on Expo's cloud macOS infrastructure — no Mac hardware required. EAS Submit can then push the resulting `.ipa` directly to App Store Connect:

```bash
eas submit --platform ios
```

### First-time EAS setup

```bash
eas build:configure
```

This generates `eas.json`. Commit it to the repo.

---

## Project structure

```
App.tsx          — root component
app.json         — Expo config (name, icons, permissions)
flake.nix        — Nix dev environment
scripts/dev.sh   — helper: start server + send QR via sapo notify
assets/          — icons and splash screen images
```
