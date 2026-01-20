#!/bin/bash

# Diagnostic script to check dataset JSON files

echo "============================================================"
echo "Checking NetCDF Dataset JSON Files"
echo "============================================================"

echo ""
echo "1. Checking original.json has 'data' field:"
python3 << 'EOF'
import json
with open('volumes/datawork/dataset/netcdf_example/data/audio/original/original.json', 'r') as f:
    data = json.load(f)
print(f"   ✓ Has 'data' field: {'data' in data}")
print(f"   ✓ Number of entries: {len(data.get('data', {}))}")
EOF

echo ""
echo "2. Checking netcdf_analysis.json structure:"
python3 << 'EOF'
import json
with open('volumes/datawork/dataset/netcdf_example/processed/netcdf_analysis/netcdf_analysis.json', 'r') as f:
    data = json.load(f)
print(f"   ✓ Has 'data' field: {'data' in data}")
print(f"   ✓ Has 'sft' field: {'sft' in data and data['sft'] is not None}")
if 'sft' in data and data['sft']:
    print(f"   ✓ SFT keys: {list(data['sft'].keys())}")
EOF

echo ""
echo "3. Checking dataset.json paths:"
python3 << 'EOF'
import json
with open('volumes/datawork/dataset/netcdf_example/dataset.json', 'r') as f:
    data = json.load(f)
print(f"   ✓ Audio JSON path: {data['datasets']['original']['json']}")
print(f"   ✓ Spectro JSON path: {data['datasets']['netcdf_analysis']['json']}")
EOF

echo ""
echo "============================================================"
echo "If all checks pass, restart Docker with:"
echo "  docker compose --env-file test.env down"
echo "  docker compose --env-file test.env up -d"
echo "============================================================"
