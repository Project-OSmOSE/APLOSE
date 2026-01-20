#!/bin/bash

set -e

echo "============================================================"
echo "APLOSE NetCDF Support - Complete Update Script"
echo "============================================================"
echo ""

# Pull latest changes
echo "1. Pulling latest changes from git..."
git pull origin claude/netcdf-spectrogram-support-Fj75u
echo "✓ Git pull complete"
echo ""

# Setup test data
echo "2. Setting up NetCDF test dataset..."
if [ -f "./setup_netcdf_test_data.sh" ]; then
    ./setup_netcdf_test_data.sh
else
    echo "   Copying test data manually..."
    mkdir -p volumes/datawork/dataset
    cp -r example_datasets/netcdf_example volumes/datawork/dataset/
    echo "✓ Test dataset copied"
fi
echo ""

# Stop all containers
echo "3. Stopping Docker containers..."
docker compose --env-file test.env down
echo "✓ Containers stopped"
echo ""

# Rebuild backend (includes new NetCDF API)
echo "4. Rebuilding backend Docker image..."
echo "   This includes the new NetCDF API endpoint..."
docker compose --env-file test.env build osmose_back
echo "✓ Backend rebuilt"
echo ""

# Rebuild frontend (includes spectrogram example page)
echo "5. Rebuilding frontend Docker image..."
docker compose --env-file test.env build osmose_front
echo "✓ Frontend rebuilt"
echo ""

# Start all containers
echo "6. Starting Docker containers..."
docker compose --env-file test.env up -d
echo "✓ Containers started"
echo ""

# Wait for backend to be ready
echo "7. Waiting for backend to be ready..."
sleep 10
echo "✓ Services should be ready"
echo ""

# Check backend logs
echo "8. Checking backend logs..."
docker compose --env-file test.env logs osmose_back | tail -20
echo ""

echo "============================================================"
echo "Update Complete!"
echo "============================================================"
echo ""
echo "You can now:"
echo "  1. Access APLOSE at: http://localhost:8080"
echo "  2. Login as admin"
echo "  3. View the Spectrogram Example page (in sidebar)"
echo "  4. Import the 'netcdf_example' dataset"
echo ""
echo "If you see errors, check the logs:"
echo "  docker compose --env-file test.env logs osmose_back"
echo "  docker compose --env-file test.env logs osmose_front"
echo ""
echo "============================================================"
