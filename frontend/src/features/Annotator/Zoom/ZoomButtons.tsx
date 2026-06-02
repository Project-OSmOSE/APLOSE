import React, { Fragment } from 'react';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';
import { useZoomIn, useZoomInLevel, useZoomOut, useZoomOutLevel } from './hooks'
import styles from './styles.module.scss';
import { useAppSelector } from '@/features/App';
import { selectZoom } from './selectors';

export const ZoomButtons: React.FC = () => {
    const zoom = useAppSelector(selectZoom)
    const zoomOutLevel = useZoomOutLevel()
    const zoomOut = useZoomOut()
    const zoomInLevel = useZoomInLevel()
    const zoomIn = useZoomIn()

    if (!zoomInLevel && !zoomOutLevel) return <Fragment/>
    return <Fragment>
        <MdZoomOut className={ [ styles.zoom, zoomOutLevel ? '' : styles.disabled ].join(' ') }
                   onClick={ () => zoomOut() }/>
        <MdZoomIn className={ [ styles.zoom, zoomInLevel ? '' : styles.disabled ].join(' ') }
                  onClick={ () => zoomIn() }/>
        <p>{ zoom }x</p>
    </Fragment>
}
