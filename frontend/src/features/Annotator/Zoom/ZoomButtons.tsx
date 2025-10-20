import React, { Fragment } from "react";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { useAnnotatorZoom } from './hooks'
import styles from "./styles.module.scss";

export const ZoomButtons: React.FC = () => {
  const {
    zoom,
    zoomInLevel, zoomOutLevel,
    zoomIn, zoomOut,
  } = useAnnotatorZoom()

  if (!zoomInLevel && !zoomOutLevel) return <Fragment/>
  return <Fragment>
    <MdZoomOut className={ [ styles.zoom, zoomOutLevel ? '' : styles.disabled ].join(' ') }
               onClick={ () => zoomOut() }/>
    <MdZoomIn className={ [ styles.zoom, zoomInLevel ? '' : styles.disabled ].join(' ') }
              onClick={ () => zoomIn() }/>
    <p>{ zoom }x</p>
  </Fragment>
}
