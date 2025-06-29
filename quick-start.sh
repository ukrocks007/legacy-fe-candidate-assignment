#!/bin/bash

# Quick Start Wrapper Script
# Usage: ./quick-start.sh YOUR_DYNAMIC_ENV_ID

if [ $# -eq 0 ]; then
    echo "❌ Error: Dynamic.xyz Environment ID is required"
    echo ""
    echo "Usage: $0 YOUR_DYNAMIC_ENV_ID"
    echo ""
    echo "Example:"
    echo "  $0 12345678-1234-1234-1234-123456789abc"
    echo ""
    echo "Get your Environment ID from: https://app.dynamic.xyz/"
    exit 1
fi

DYNAMIC_ENV_ID="$1"

echo "🚀 Starting Web3 Message Signer & Verifier with Environment ID: $DYNAMIC_ENV_ID"
echo ""

# Run the setup script with the environment ID
./setup.sh --env-id="$DYNAMIC_ENV_ID"
