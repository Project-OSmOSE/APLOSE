#!/bin/bash

# Setup script for NetCDF test dataset
# This script copies the example NetCDF dataset to the Docker volumes directory

set -e

echo "============================================================"
echo "Setting up NetCDF test dataset for APLOSE"
echo "============================================================"

# Check if example dataset exists
if [ ! -d "example_datasets/netcdf_example" ]; then
    echo "Error: example_datasets/netcdf_example not found!"
    echo "Please run 'git pull' to get the latest changes."
    exit 1
fi

# Create volumes directory if it doesn't exist
mkdir -p volumes/datawork/dataset

# Copy example dataset to volumes
echo "Copying example dataset to volumes/datawork/dataset/..."
cp -r example_datasets/netcdf_example volumes/datawork/dataset/

echo "✓ Test dataset copied successfully!"
echo ""
echo "Next steps:"
echo "1. Start or restart Docker:"
echo "   docker compose --env-file test.env down"
echo "   docker compose --env-file test.env up -d"
echo ""
echo "2. Wait for services to start (check with: docker compose --env-file test.env logs backend)"
echo ""
echo "3. Open APLOSE at http://localhost:8080"
echo ""
echo "4. Try importing the 'netcdf_example' dataset"
echo ""
echo "============================================================"
