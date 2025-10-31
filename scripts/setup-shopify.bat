@echo off
REM Setup script for Shopify CLI and theme development (Windows)
REM Run this script to configure your development environment

echo 🚀 Setting up Of Gold And Grace Shopify Theme Development
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
set NODE_VERSION=%NODE_VERSION:v=%
set REQUIRED_VERSION=18.0.0

echo ✅ Node.js %NODE_VERSION% detected

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed

REM Check if Shopify CLI is installed
shopify version >nul 2>&1
if errorlevel 1 (
    echo.
    echo 📥 Installing Shopify CLI...
    call npm install -g @shopify/cli @shopify/theme

    if errorlevel 1 (
        echo ❌ Failed to install Shopify CLI
        echo Try: npm install -g @shopify/cli @shopify/theme
        pause
        exit /b 1
    )
)

echo ✅ Shopify CLI detected

REM Authenticate with Shopify
echo.
echo 🔐 Authenticating with Shopify...
echo You'll need your Shopify store domain and access token.
echo Get your access token from: https://your-store.myshopify.com/admin/settings/apps/development
echo.

shopify auth login

if errorlevel 1 (
    echo ❌ Shopify authentication failed
    echo Make sure you have the correct store domain and access token
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start development server
echo 2. Open your browser to the development URL shown
echo 3. Make changes and see them update in real-time
echo.
echo Available commands:
echo - npm run dev          # Start development server
echo - npm run dev:live     # Start with live reload
echo - npm run deploy       # Deploy to your store
echo - npm run lint         # Run linting checks
echo - npm run format       # Format code
echo.

pause
