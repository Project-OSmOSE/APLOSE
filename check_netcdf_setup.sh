#!/bin/bash

echo "============================================================"
echo "NetCDF Setup Diagnostic Check"
echo "============================================================"
echo ""

# Check git status
echo "1. Git Status:"
git status --short
if [ $? -eq 0 ]; then
    echo "✓ Git repository is clean"
else
    echo "✗ Git issues detected"
fi
echo ""

# Check if backend API file exists
echo "2. Backend NetCDF API:"
if [ -f "backend/api/views/netcdf.py" ]; then
    echo "✓ NetCDF API view file exists"
else
    echo "✗ NetCDF API view file missing"
fi
echo ""

# Check if example spectrogram exists
echo "3. Static Example File:"
if [ -f "backend/static/examples/example_spectrogram.nc" ]; then
    SIZE=$(ls -lh backend/static/examples/example_spectrogram.nc | awk '{print $5}')
    echo "✓ Example spectrogram exists ($SIZE)"
else
    echo "✗ Example spectrogram missing"
fi
echo ""

# Check dataset JSON files
echo "4. Dataset JSON Files:"
if [ -f "volumes/datawork/dataset/netcdf_example/dataset.json" ]; then
    echo "✓ dataset.json exists"
    # Check if paths are absolute
    if grep -q '"/opt/datawork/' volumes/datawork/dataset/netcdf_example/dataset.json; then
        echo "✓ dataset.json has absolute paths"
    else
        echo "✗ dataset.json has relative paths (needs fix)"
    fi
else
    echo "✗ dataset.json missing"
fi

if [ -f "volumes/datawork/dataset/netcdf_example/data/audio/original/original.json" ]; then
    echo "✓ original.json exists"
    # Check if has data field
    if grep -q '"data"' volumes/datawork/dataset/netcdf_example/data/audio/original/original.json; then
        echo "✓ original.json has 'data' field"
    else
        echo "✗ original.json missing 'data' field"
    fi
else
    echo "✗ original.json missing"
fi

if [ -f "volumes/datawork/dataset/netcdf_example/processed/netcdf_analysis/netcdf_analysis.json" ]; then
    echo "✓ netcdf_analysis.json exists"
    # Check if has sft field
    if grep -q '"default_sft"' volumes/datawork/dataset/netcdf_example/processed/netcdf_analysis/netcdf_analysis.json; then
        echo "✓ netcdf_analysis.json has SFT configuration"
    else
        echo "✗ netcdf_analysis.json missing SFT configuration"
    fi
else
    echo "✗ netcdf_analysis.json missing"
fi
echo ""

# Check Docker status
echo "5. Docker Status:"
docker compose --env-file test.env ps
echo ""

echo "============================================================"
echo "Recommendation:"
echo "============================================================"
echo ""
echo "If all checks pass (✓), run:"
echo "  chmod +x update_netcdf_support.sh"
echo "  ./update_netcdf_support.sh"
echo ""
echo "This will rebuild Docker with all the new NetCDF support."
echo ""
