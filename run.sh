#!/bin/bash
cd "$(dirname "$0")"

if [ ! -t 0 ]; then
    if command -v xdg-terminal-exec >/dev/null; then
        exec xdg-terminal-exec bash -c "\"$0\" \"$@\""
    elif command -v x-terminal-emulator >/dev/null; then
        exec x-terminal-emulator -e "bash -c '\"$0\" \"$@\"'"
    elif command -v ptyxis >/dev/null; then
        exec ptyxis -- bash -c "\"$0\" \"$@\""
    fi
fi

echo "======================================"
echo "      Starting Game...                "
echo "======================================"
echo "Installing dependencies if needed..."
npm install

if grep -q '"dev"' package.json; then
    echo "Running game in dev mode..."
    npm run dev -- --open || npm run dev
elif grep -q '"start"' package.json; then
    echo "Running game in start mode..."
    npm start
else
    echo "No dev or start script found in package.json."
fi

echo "Game server stopped or failed."
read -p "Press Enter to close this window..."
