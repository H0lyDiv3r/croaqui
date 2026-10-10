#!/usr/bin/env bash
set -e

# Launcher for running Croaqui desktop app inside an isolated network namespace
# Supports both 'wails dev' (live reload) and compiled binary modes.

PEER="${1:-peer1}"
MODE="${2:-dev}"

if [[ "$PEER" != "peer1" && "$PEER" != "peer2" ]]; then
    echo "Usage: $0 [peer1|peer2] [dev|bin]"
    echo "  Example for live reload (default): $0 peer1"
    echo "  Example for compiled binary:      $0 peer1 bin"
    exit 1
fi

# Check if namespace exists
if ! ip netns list | grep -q "$PEER"; then
    echo "Network namespace '$PEER' not found!"
    echo "Please run: sudo ./scripts/setup_isolated_netns.sh first."
    exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Allowing local GUI display access..."
xhost +local: 2>/dev/null || true

REAL_USER="${SUDO_USER:-$USER}"

echo "Starting $PEER in isolated network namespace (mode: $MODE)..."
echo "Namespace IP configuration:"
sudo ip netns exec "$PEER" ip -br addr show

# Determine which command to run
if [[ "$MODE" == "bin" ]]; then
    APP_BIN="${ROOT_DIR}/build/bin/croaqui"
    if [[ ! -f "$APP_BIN" ]]; then
        echo "Binary not found at $APP_BIN, building..."
        (cd "$ROOT_DIR" && wails build -debug || go build -o build/bin/croaqui main.go)
    fi
    EXEC_CMD="$APP_BIN"
else
    # Default: wails dev
    EXEC_CMD="wails dev"
fi

# Execute command inside namespace with full user environment and PATH
sudo -E ip netns exec "$PEER" sudo -u "$REAL_USER" \
    env PATH="$PATH:$HOME/go/bin:/usr/local/go/bin:$HOME/.volta/bin" \
        DISPLAY="${DISPLAY:-:0}" \
        XAUTHORITY="${XAUTHORITY:-$HOME/.Xauthority}" \
        WAYLAND_DISPLAY="${WAYLAND_DISPLAY}" \
        XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR}" \
        HOME="${HOME}" \
        bash -c "cd '$ROOT_DIR' && $EXEC_CMD"
