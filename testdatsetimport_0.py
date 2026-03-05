# -*- coding: utf-8 -*-
"""
Created on Tue Jan 20 14:48:49 2026

@author: a5278
"""
runfile('path/to/your/script.py', wdir='path/to/script_directory', args='arg1 arg2 "arg with spaces"')



python examples/create_simple_example_dataset.py volumes/datawork/dataset/example -n 5

runfile('examples/create_simple_example_dataset.py',args='volumes/datawork/dataset/example -n 5')

#%%

import requests
import json

# Configuration
APLOSE_URL = "http://localhost:8080/graphql"

# GraphQL mutation
mutation = """
mutation {
  importSimpleDataset(
    name: "Example Dataset"
    path: "example"
  ) {
    ok
    message
  }
}
"""

# Execute the mutation
response = requests.post(
    APLOSE_URL,
    json={'query': mutation},
    headers={'Content-Type': 'application/json'}
)

# Check response
if response.status_code == 200:
    result = response.json()
    print("✓ Success!")
    print(json.dumps(result, indent=2))
else:
    print(f"✗ Error: HTTP {response.status_code}")
    print(response.text)
    
    
#%%


docker compose --env-file test.env exec osmose_back poetry run python manage.py import_simple_dataset my_dataset --name "my_dataset"
    

#%%

import xarray as xr


p = r"C:\Users\a5278\Documents\pam2025\apnetcdf2\t4\APLOSE-IMR\my_dataset\2024_01_15_08_00_00.nc"

nc = xr.open_dataset(p )