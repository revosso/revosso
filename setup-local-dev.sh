#!/bin/bash

# ===========================================
# Revosso Local Development Setup Script
# ===========================================
# This script sets up your local development environment
# for the subdomain-based architecture.

set -e

echo "================================================"
echo "Revosso Local Development Setup"
echo "================================================"
echo ""

# Check if running on macOS or Linux
if [[ "$OSTYPE" != "darwin"* && "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script is for macOS and Linux only."
    echo "   For Windows, manually edit C:\\Windows\\System32\\drivers\\etc\\hosts"
    echo "   and add these lines:"
    echo ""
    echo "   127.0.0.1 revosso.local"
    echo "   127.0.0.1 manage.revosso.local"
    echo ""
    exit 1
fi

# Check if hosts entries already exist
if grep -q "revosso.local" /etc/hosts && grep -q "manage.revosso.local" /etc/hosts; then
    echo "✅ Hosts file already configured"
    echo ""
else
    echo "📝 Adding entries to /etc/hosts..."
    echo "   (This requires sudo/admin password)"
    echo ""
    
    # Backup hosts file
    sudo cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d%H%M%S)
    
    # Add entries
    echo "" | sudo tee -a /etc/hosts > /dev/null
    echo "# Revosso local development domains" | sudo tee -a /etc/hosts > /dev/null
    echo "127.0.0.1 revosso.local" | sudo tee -a /etc/hosts > /dev/null
    echo "127.0.0.1 manage.revosso.local" | sudo tee -a /etc/hosts > /dev/null
    
    echo "✅ Hosts file updated"
    echo ""
fi

# Verify environment variables
echo "🔍 Checking environment variables..."
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "   Please copy .env.example to .env and configure it."
    exit 1
fi

# Check required Auth0 variables
required_vars=(
    "NEXT_PUBLIC_AUTH0_DOMAIN"
    "NEXT_PUBLIC_AUTH0_CLIENT_ID"
    "NEXT_PUBLIC_AUTH0_AUDIENCE"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "   Please add these to your .env file."
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
    echo "✅ Dependencies installed"
else
    echo "❌ pnpm not found. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi
echo ""

# Success message
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "You can now access the application:"
echo ""
echo "  Landing Page:  http://revosso.local:3000"
echo "  Dashboard:     http://manage.revosso.local:3000"
echo ""
echo "To start the development server:"
echo ""
echo "  pnpm dev"
echo ""
echo "================================================"
echo ""
echo "⚠️  IMPORTANT: Auth0 Configuration"
echo "================================================"
echo ""
echo "Make sure your Auth0 Application has these URLs configured:"
echo ""
echo "Allowed Callback URLs:"
echo "  - http://localhost:3000/callback"
echo "  - http://revosso.local:3000/callback"
echo "  - http://manage.revosso.local:3000/callback"
echo ""
echo "Allowed Logout URLs:"
echo "  - http://localhost:3000"
echo "  - http://revosso.local:3000"
echo "  - http://manage.revosso.local:3000"
echo ""
echo "Allowed Web Origins:"
echo "  - http://localhost:3000"
echo "  - http://revosso.local:3000"
echo "  - http://manage.revosso.local:3000"
echo ""
echo "================================================"
