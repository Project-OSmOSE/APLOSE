<br>
<div align="center">

![APLOSE logo](./frontend/public/images/logo/x96.png)

<br>

![GitHub License](https://img.shields.io/github/license/Project-OSmOSE/APLOSE)
![Open Source Love](https://img.shields.io/badge/open%20source-♡-lightgrey)


[![Backend Tests][backend-badge]][backend-link]
[![Frontend Tests][frontend-badge]][frontend-link]

[backend-badge]: https://github.com/Project-OSmOSE/APLOSE/actions/workflows/backend.yml/badge.svg
[backend-link]: https://github.com/Project-OSmOSE/APLOSE/actions/workflows/backend.yml
[frontend-badge]: https://github.com/Project-OSmOSE/APLOSE/actions/workflows/frontend.yml/badge.svg
[frontend-link]: https://github.com/Project-OSmOSE/APLOSE/actions/workflows/frontend.yml

**APLOSE**, a scalable web-based annotation tool for marine bioacoustics.

[Documentation](https://project-osmose.github.io/APLOSE)

<br/>

</div>

**APLOSE** is developed and maintained by the [OSmOSE team](https://osmose.ifremer.fr/) in an academic 
research setting, without any direct commercial purpose and in accordance with 
the institution's rules.

Its first purpose is to help the marine bioacoustic research community in their studies. 
Its usage can be extended to all kind of acoustic studies. It can also be used to create 
reference dataset of AI or to check detectors output.

**APLOSE** allows to create participative annotation campaign where many users can annotate 
your data, without the need of sending hard-drives. The annotation process can consist 
of two phases : "Annotation" and "Verification". The "Annotation" phase allows to create 
new annotations on a clear spectrogram. On the "Verification" phase, you can check other user's 
annotations or event detectors output on the spectrogram, you can also edit the annotations
or add missing ones.

All the annotations are stored in a database and can be exported at any time.

**APLOSE** is composed of a React frontend, located in "frontend" folder, and
a Django backend, located in the "backend" folder ("api" app).
It rely on spectrograms pre-calculated with our package [OSEkit](https://github.com/Project-OSmOSE/OSEkit).

The project is part of an initiative to disseminate knowledge and share
research tools in accordance with the principles of open science.



<br/>
<div align="center">

[![OSmOSE logo](https://raw.githubusercontent.com/Project-OSmOSE/OSEkit/refs/heads/main/docs/logo/osmose_texte_sombre_small.png)](https://osmose.ifremer.fr/)

</div>

<br/>
<sub>© OSmOSE team 2025-present</sub>
