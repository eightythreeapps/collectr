#!/bin/bash

echo "🔥 Starting Firebase Emulators for Collectr..."

# Set the project to demo mode
export FIREBASE_PROJECT_ID=demo-collectr
export GCLOUD_PROJECT=demo-collectr

# Start emulators
cd firebase
firebase emulators:start --project=demo-collectr --config firebase-emulator.json