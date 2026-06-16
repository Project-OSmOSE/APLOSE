import { createLazyFileRoute } from '@tanstack/react-router'
import React, { Fragment, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, ButtonGroup, DocumentationButton, ExternalLink } from '@/components/base/Button';
import { useHomeCollaborators } from '@/api/collaborator';
import logo from '/images/ode_logo_192x192.png';
import styles from './public.module.scss';
import { AltArrowLeft, AltArrowRight } from '@solar-icons/react';
import { SiDiscord } from 'react-icons/si';


const Home = React.memo(() => <Fragment>
    <h1 className={ styles.Center }>
        Welcome to the overview page for APLOSE:
        Annotation Platform for Ocean Sound Explorers
    </h1>
    <p>
        APLOSE is the
        <ExternalLink inText color="primary" href="https://osmose.ifremer.fr">
            <img src={ logo } alt="OSmOSE" height={ 20 }/>OSmOSE
        </ExternalLink>
        team platform for marine acoustic research. It is an open-source annotation platform that facilitates
        collaboration in the field of underwater acoustics.
        Dive into our short video presentation to find out more about APLOSE.
    </p>
    <video controls className={ styles.Video }>
        <source src="video/home/démo_APLOSE.mp4" type="video/mp4"/>
    </video>

    <h2 className={ styles.Center }>Manual annotation of marine sounds</h2>
    <p>
        Manual annotation is the action of assigning labels on spectrograms (time/frequency representation of
        the sound) of a dataset. A dataset is made of audio files that will be annotated by one or several
        annotators during an annotation campaign.
        These audio files can be divided into smaller audio segments, depending on the sounds of interest. An
        annotation task is a spectrogram and its matching audio segment associated with a set of labels from
        which the annotator must choose to make the annotations. Labels are tags that designate the sounds to
        search on the spectrogram.
        They can describe broad categories of sound (biophony, geophony, anthropophony), groups of species
        (odontocetes, black fish, etc) or more specific types of sound (air gun, blue whale D-calls, etc).
        Within an annotation campaign, each annotator is given a list of annotation tasks to accomplish. There
        are 2 classes of annotation: weak annotation,
        the annotator annotates the whole spectrogram from the list of available labels ; and strong
        annotation, the annotator draws a labeled time-frequency box around the targeted sound event.
    </p>
    <img src="images/home/GIF.gif" alt="Glider" className="full-width-margin-top"/>

    <h2 className={ styles.Center }>Platform features</h2>
    <p>
        Explore the core functionalities of APLOSE through detailed screenshots that illustrate how our
        platform operates. Among other, APLOSE allows to:
    </p>
    <ul>
        <li>Visualize and zoom on pre-computed spectrogram</li>
        <li>Play the sound at different speeds</li>
        <li>Add custom labels on the whole spectrogram or draw boxes around the sounds</li>
        <li>Specify a confidence indicator on each annotation</li>
        <li>Add comments on each annotation</li>
        <li>Easily download the results in a CSV format</li>
    </ul>
    <CarouselParent/>

    <h2 className={ styles.Center }>Resources and training</h2>
    <p>
        To ensure all new users can effectively exploit APLOSE, we offer a range of tutorials and training
        documents. These resources are designed to help you quickly become proficient in navigating the
        interface and using the available tools.
    </p>
    <ButtonGroup className={ styles.Center }>
        <DocumentationButton/>
        /
        <ExternalLink href="/app/images/campagne.pdf" target="_blank">
            Annotation Campaign APOCADO
        </ExternalLink>
    </ButtonGroup>

    <h2 className={ styles.Center }>Collaboration and open source</h2>
    <p>
        APLOSE platform was used in several research projects involving citizen science with the Astrolabe
        Expeditions organization
        <ExternalLink href="https://www.astrolabe-expeditions.org/" target="_blank">Astrolabe</ExternalLink>,
        the Sorbonne university and the Institut d’Alembert. It also helps with delphinidae monitoring along the French
        Mediterranean coast by the association
        <ExternalLink href="https://miraceti.org/" target="_blank">MIRACETI</ExternalLink>.
        The annotations made through APLOSE also enabled to evaluate automated detection algorithm performance and to
        create a geophony reference dataset. APLOSE relies on its open-source community, welcoming contributions from
        everywhere to enhance and develop the platform further. For example, the platform was deployed on the
        <ExternalLink href="https://www.france-energies-marines.org/" target="_blank">France Energies
            Marines</ExternalLink> server to be
        managed and used by their team. They will also take part in the development of the future
        technological improvements of APLOSE, in collaboration with the OSmOSE team.
        All the codes and associate documentations to collaborate can be found on our Github page.
    </p>

    <h2 className={ styles.Center }>Join the APLOSE community</h2>
    <p>
        By analyzing these acoustic data, help us providing a better insight into marine life behaviours,
        habitat conditions, and environmental changes. We invite you to join the APLOSE platform, whether you
        are a developer, researcher, or simply passionate about marine conservation. You can get involved with
        us in various ways: annotate data, conduct research, or develop new technological features.
        If you want to join us, or have any question, please contact us here!
    </p>
    <ButtonGroup className={ styles.Center }>
        <ExternalLink href="https://discord.gg/egqhuZFVcT" target="_blank">
            <SiDiscord/>
            Community Discord
        </ExternalLink>
    </ButtonGroup>

    <h2 className={ styles.Center }>Collaborators & Funders</h2>
    <Collaborators/>
</Fragment>)

const CarouselParent: React.FC = () => {
    const [ index, setIndex ] = useState<number>(0);
    const [ isCarouselOpenedInModal, setIsCarouselOpenedInModal ] = useState<boolean>(false);

    const toggleCarouselModal = useCallback(() => {
        setIsCarouselOpenedInModal(previous => !previous)
    }, [])

    return <Fragment>
        <Carousel index={ index } onIndexChange={ setIndex }
                  isModal={ false }
                  onClick={ toggleCarouselModal }/>

        { isCarouselOpenedInModal && createPortal(<Carousel index={ index } onIndexChange={ setIndex }
                                                            isModal={ isCarouselOpenedInModal }
                                                            onClick={ toggleCarouselModal }/>, document.body) }
    </Fragment>
}

const Carousel: React.FC<{
    index: number;
    onIndexChange(index: number): void;
    isModal: boolean;
    onClick(): void;
}> = React.memo(({ index, onIndexChange, isModal, onClick }) => {
    const trainingImages = Array.from(new Array(7)).map((_, i) => i);
    const realIndex = index % trainingImages.length

    return <div className={ [ styles.carouselContainer, isModal ? styles.modal : '' ].join(' ') }
                onClick={ onClick }>
        <div className={ styles.carousel } onClick={ e => e.stopPropagation() }>
            <Button className={ styles.previousBtn }
                    onClick={ () => onIndexChange(index - 1) }>
                <AltArrowLeft weight="Bold" size={ 24 }/>
            </Button>
            { trainingImages.map((id) => (
                <img key={ id }
                     src={ `images/home/etape${ id + 1 }.png` }
                     onClick={ !isModal ? onClick : () => {
                     } }
                     alt={ `Training Resource ${ id + 1 }` }
                     style={ { transform: `translateX(-${ realIndex * 100 }%)` } }/>
            )) }
            <Button className={ styles.nextBtn }
                    onClick={ () => onIndexChange(index + 1) }>
                <AltArrowRight weight="Bold" size={ 24 }/>
            </Button>
        </div>
    </div>
})


const Collaborators: React.FC = () => {
    const { collaborators } = useHomeCollaborators()
    return <div className={ styles.Collaborators }>
        { collaborators?.map((collaborator, index) => {
            const img = (<img key={ index }
                              src={ collaborator.thumbnail }
                              alt={ collaborator.name }
                              title={ collaborator.name }/>)
            if (!collaborator.url) return img;
            return (<a href={ collaborator.url }
                       key={ index }
                       target="_blank" rel="noreferrer">{ img }</a>)
        }) }
    </div>
}


export const Route = createLazyFileRoute('/(public)/')({
    component: Home,
})
