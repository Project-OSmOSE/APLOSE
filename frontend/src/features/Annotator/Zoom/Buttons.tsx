import React from 'react';
import { MagniferZoomIn, MagniferZoomOut } from '@solar-icons/react';
import { Button, Note } from '@/components/base';
import { useZoomContext } from './Root'
import styles from './styles.module.scss';

/** Zoom.Buttons
 *
 * Use within Zoom.Root
 */
export const ZoomButtons: React.FC = () => {
    const {
        zoomLevel,
        zoomType,
        zoomInLevel,
        canZoomIn,
        zoomIn,
        zoomOutLevel,
        canZoomOut,
        zoomOut,
    } = useZoomContext()

    if (zoomInLevel === null && zoomOutLevel === null) return <Note color="medium" small>No zoom available</Note>
    return <div className={ styles.Buttons }>
        <div className={ styles.Inner }>
            <Button onClick={ () => zoomOut() } aria-label="Zoom in"
                    disabled={ !canZoomOut } className={ styles.Button }>
                <MagniferZoomOut weight="Linear" size={ 20 }/>
                { canZoomOut === 'digital' &&
                    <Note color="warning" small className={ styles.DigitalNote }>D</Note> }
            </Button>
            <Button onClick={ () => zoomIn() } aria-label="Zoom out"
                    disabled={ !canZoomIn } className={ styles.Button }>
                <MagniferZoomIn weight="Linear" size={ 20 }/>
                { canZoomIn === 'digital' &&
                    <Note color="warning" small className={ styles.DigitalNote }>D</Note> }
            </Button>
        </div>
        <div className={ styles.Inner }>
            {/* Inline width specification to avoir small visual glitch due to a non mono font */ }
            <Note color="medium" style={ { width: `${ zoomLevel.toString().length + 1 }ch` } }>{ zoomLevel }x</Note>
            { zoomType === 'digital' && <Note color="danger">Digital</Note> }
        </div>
    </div>
}
