"""
Setup script for APLOSE Audio Processor.
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read README
readme_file = Path(__file__).parent / 'README.md'
long_description = readme_file.read_text() if readme_file.exists() else ''

setup(
    name='aplose-audio-processor',
    version='1.0.0',
    description='Generate APLOSE-compatible NetCDF spectrogram files from audio files',
    long_description=long_description,
    long_description_content_type='text/markdown',
    author='APLOSE Team',
    url='https://github.com/Project-ODE/APLOSE-IMR',
    packages=find_packages(),
    install_requires=[
        'numpy>=1.20.0',
        'scipy>=1.7.0',
        'xarray>=2023.0.0',
        'netcdf4>=1.6.0',
        'soundfile>=0.12.0',
    ],
    extras_require={
        'dev': [
            'pytest>=7.0.0',
            'black>=22.0.0',
            'flake8>=4.0.0',
        ]
    },
    entry_points={
        'console_scripts': [
            'aplose-audio-processor=aplose_audio_processor.cli:main',
        ],
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Science/Research',
        'Topic :: Scientific/Engineering :: Information Analysis',
        'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
    ],
    python_requires='>=3.8',
)
