import React, { Fragment } from 'react';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';
import { useZoomIn, useZoomOut } from './hooks'
import styles from './styles.module.scss';
import { useAppSelector } from '@/features/App';
import { selectZoom, selectZoomInLevel, selectZoomOutLevel } from './selectors';

export const ZoomButtons: React.FC = () => {
  const zoom = useAppSelector(selectZoom)
  const zoomOutLevel = useAppSelector(selectZoomOutLevel)
  const zoomOut = useZoomOut()
  const zoomInLevel = useAppSelector(selectZoomInLevel)
  const zoomIn = useZoomIn()

  if (!zoomInLevel && !zoomOutLevel) return <Fragment/>
  return <Fragment>
    <MdZoomOut className={ [ styles.zoom, zoomOutLevel ? '' : styles.disabled ].join(' ') }
               onClick={ () => zoomOut() }/>
    <MdZoomIn className={ [ styles.zoom, zoomInLevel ? '' : styles.disabled ].join(' ') }
              onClick={ () => zoomIn() }/>
    <p>{ Math.pow(2, zoom) }x</p>
  </Fragment>
}
