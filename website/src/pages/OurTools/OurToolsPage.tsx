import React from 'react';
import styles from './OurToolsPage.module.scss'
import OSEkitLogo from '../../img/logo/osekit_x96.png';
import APLOSELogo from '../../img/logo/aplose_x96.png';
import { SiDiscord, SiGithub, SiPython } from 'react-icons/si';
import { IoEarthOutline, IoGlobeOutline, IoLayersOutline, IoLibraryOutline } from 'react-icons/io5';

export const OurToolsPage: React.FC = () => {
    return <div className={ styles.page }>

        <div>
            <h2>Our tools</h2>
            <p>
                We develop open source tools, under MIT licence.<br/>
                All our tools are available on our <a target="_blank" rel="noopener noreferrer"
                                                      href="https://github.com/Project-OSmOSE">
                <SiGithub/> Team Github
            </a>.<br/>
                You can join us on our <a target="_blank" rel="noopener noreferrer"
                                          href="https://discord.gg/egqhuZFVcT">
                <SiDiscord/> Community Discord
            </a> dedicated to our tools users.
            </p>
        </div>

        <div className={ styles.tool }>
            <img src={ OSEkitLogo } alt="OSEkit"/>
            <h5>OSEkit</h5>
            <p>A Python package dedicated to the management and analysis of data in passive acoustics
                monitoring.</p>
            <div className={ styles.links }>
                <a className={ styles.link } target="_blank" href="https://github.com/Project-OSmOSE/OSEkit"
                   rel="noreferrer">
                    <SiGithub/>
                    Repository
                </a>
                <a className={ styles.link } target="_blank" href="https://pypi.org/project/osekit/"
                   rel="noreferrer">
                    <SiPython/>
                    <code>pip install osekit</code>
                </a>
                <a className={ styles.link } target="_blank" href="https://project-osmose.github.io/OSEkit/"
                   rel="noreferrer">
                    <IoLibraryOutline/>
                    Documentation
                </a>
            </div>
        </div>

        <div className={ styles.tool }>
            <img src={ APLOSELogo } alt="APLOSE"/>
            <h5>APLOSE</h5>
            <p>A web-based annotation platform for passive acoustic monitoring.</p>
            <div className={ styles.links }>
                <a className={ styles.link } target="_blank" href="https://github.com/Project-OSmOSE/APLOSE"
                   rel="noreferrer">
                    <SiGithub/>
                    Repository
                </a>
                <a className={ styles.link } target="_blank" href="https://project-osmose.github.io/APLOSE/"
                   rel="noreferrer">
                    <IoLibraryOutline/>
                    Documentation
                </a>
                <a className={ styles.link } target="_blank" href="https://osmose.ifremer.fr/app/"
                   rel="noreferrer">
                    <IoGlobeOutline/>
                    OSmOSE instance
                </a>
            </div>
        </div>

        <div className={ [ styles.tool, styles.metadatax ].join(' ') }>
            <p className={ styles.logo }>Mx</p>
            <h5>MetadataX</h5>
            <p>
                A standardized metadata database for passive acoustic monitoring studies.
                Co-created with{ '\u00A0' }<a target="_blank" href="https://www.shom.fr/" rel="noreferrer">
                <img src="https://www.shom.fr/sites/default/files/Shom_horizontal_0.png" alt="SHOM"
                     className={ styles.shom }/>
            </a>
            </p>
            <div className={ styles.links }>
                <a className={ styles.link } target="_blank" href="https://github.com/PAM-Standardization/metadatax"
                   rel="noreferrer">
                    <SiGithub/>
                    Repository
                </a>
                <a className={ styles.link } target="_blank"
                   href="https://github.com/PAM-Standardization/metadatax/blob/main/schema.svg"
                   rel="noreferrer">
                    <IoLayersOutline/>
                    Database schema
                </a>
                <a className={ styles.link } href="/projects"
                   rel="noreferrer">
                    <IoEarthOutline/>
                    Our projects
                </a>
            </div>
        </div>

    </div>
}