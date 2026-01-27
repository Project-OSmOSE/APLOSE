<br>
<div align="center">

![APLOSE logo](./frontend/public/images/logo/x96.png)

<br>

[![DOI][doi-badge]][doi-link]
![GitHub License](https://img.shields.io/github/license/Project-OSmOSE/APLOSE)
![Open Source Love](https://img.shields.io/badge/open%20source-♡-lightgrey)


[![Backend Tests][backend-badge]][backend-link]
[![Frontend Tests][frontend-badge]][frontend-link]

[doi-badge]: https://zenodo.org/badge/DOI/10.5281/zenodo.10467999.svg
[doi-link]: https://doi.org/10.5281/zenodo.10467999
[backend-badge]: https://github.com/Project-OSmOSE/APLOSE/actions/workflows/backend.yml/badge.svg
[backend-link]: https://github.com/Project-OSmOSE/APLOSE/actions/workflows/backend.yml
[frontend-badge]: https://github.com/Project-OSmOSE/APLOSE/actions/workflows/frontend.yml/badge.svg
[frontend-link]: https://github.com/Project-OSmOSE/APLOSE/actions/workflows/frontend.yml

**APLOSE**, a scalable web-based annotation tool for marine bioacoustics.

[Presentation](#presentation) •
[Usage](#usage) •
[Documentation](https://project-osmose.github.io/APLOSE)

<br/>

</div>

### Presentation

**APLOSE** first purpose is to help the marine bioacoustic research community in their studies. 
Its usage can be extended to all kind of acoustic studies. It can also be used to create 
reference datasets for AI or to check detector outputs.

**APLOSE** allows to create participative annotation campaigns where many users can annotate 
your data, without the need of physically sharing data e.g. on hard-drives. The annotation process can consist 
of two phases : "Annotation" and "Verification". The "Annotation" phase allows to create 
new annotations on a clear spectrogram. The "Verification" phase allows to check other 
users' annotations or event detectors outputs on the spectrogram, with the possibility to edit or add
annotations. All the annotations are stored in a database and can be
exported at any time.

**APLOSE** is composed of a React frontend, located in "frontend" folder, and
a Django backend, located in the "backend" folder ("api" app).
It relies on spectrograms pre-calculated with our package [OSEkit](https://github.com/Project-OSmOSE/OSEkit).

**APLOSE** is developed and maintained by the [OSmOSE team](https://osmose.ifremer.fr/) in an academic
research setting, without any direct commercial purpose and in accordance with
the institution's rules.

The project is part of an initiative to disseminate knowledge and share
research tools in accordance with the principles of open science.

<br/>

### Usage

This software is distributed under the MIT license.

You are free to use, modify, and redistribute it, provided that you retain the copyright 
notices and license text, in accordance with the terms of this license.

See the [LICENSE](./LICENSE) file for the full text.

Some third-party libraries are used in this project. Details of their licenses are 
available in the repository [dependency graph](https://github.com/Project-OSmOSE/APLOSE/network/dependencies).

This software must not be sold.

If you use this software in scientific work, please cite it in accordance with the 
[CITATION](./CITATION.cff) file.

This software is provided for research and teaching purposes. It is provided “as is,” 
without warranty. The authors and the institution cannot be held responsible for any 
damage resulting from its use.

<br/>
<br/>
<div align="center">

[![OSmOSE logo](https://raw.githubusercontent.com/Project-OSmOSE/OSEkit/refs/heads/main/docs/logo/osmose_texte_sombre_small.png)](https://osmose.ifremer.fr/)

</div>

<br/>
<sub>© OSmOSE team 2025-present</sub>
