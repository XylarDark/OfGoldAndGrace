#!/bin/bash

# Setup script for Shopify CLI and theme development
# Run this script to configure your development environment

echo "🚀 Setting up Of Gold And Grace Shopify Theme Development"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if ! [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Check if Shopify CLI is installed
if ! command -v shopify &> /dev/null; then
    echo ""
    echo "📥 Installing Shopify CLI..."
    npm install -g @shopify/cli @shopify/theme

    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Shopify CLI"
        echo "Try: npm install -g @shopify/cli @shopify/theme"
        exit 1
    fi
fi

echo "✅ Shopify CLI detected"

# Authenticate with Shopify
echo ""
echo "🔐 Authenticating with Shopify..."
echo "You'll need your Shopify store domain and access token."
echo "Get your access token from: https://your-store.myshopify.com/admin/settings/apps/development"

shopify auth login

if [ $? -ne 0 ]; then
    echo "❌ Shopify authentication failed"
    echo "Make sure you have the correct store domain and access token"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start development server"
echo "2. Open your browser to the development URL shown"
echo "3. Make changes and see them update in real-time"
echo ""
echo "Available commands:"
echo "- npm run dev          # Start development server"
echo "- npm run dev:live     # Start with live reload"
echo "- npm run deploy       # Deploy to your store"
echo "- npm run lint         # Run linting checks"
echo "- npm run format       # Format code"
