#!/usr/bin/env bash
# Start Expo bound to the Tailscale interface, generate a QR code,
# and send it via sapo notify so you can open the app on your iPhone.
#
# Prerequisites (all provided by the nix dev shell):
#   - node / npx (nodejs_22)
#   - qrencode
#   - sapo CLI (pre-installed on the host machine)
#
# Usage:
#   ./scripts/dev.sh           # default port 8081
#   EXPO_PORT=8082 ./scripts/dev.sh

set -euo pipefail

TAILSCALE_HOST="nixos.tailee43b7.ts.net"
PORT="${EXPO_PORT:-8081}"
QR_FILE="/tmp/choreo-expo-qr.png"

# The exp:// URL is what Expo Go uses to connect to the Metro bundler.
EXPO_URL="exp://${TAILSCALE_HOST}:${PORT}"

echo "Starting Expo on ${TAILSCALE_HOST}:${PORT}..."
echo "Expo Go URL: ${EXPO_URL}"

# Generate QR code and send via sapo notify (runs in background so
# we can send the image as soon as Metro is ready).
(
  sleep 5  # give Metro a moment to start
  qrencode -o "$QR_FILE" -s 8 "$EXPO_URL"
  sapo notify "Choreo dev server ready — scan QR in Expo Go" --image "$QR_FILE"
  echo "QR code sent via sapo notify."
) &

# Start Metro bundler bound to all interfaces (0.0.0.0) so it's
# reachable over Tailscale. The --host flag sets the address Metro
# advertises in the QR code and the address it binds to.
npx expo start --host "${TAILSCALE_HOST}" --port "${PORT}"
