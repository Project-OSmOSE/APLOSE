import React, { Fragment } from "react";
import styles from '../styles.module.scss'
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { useAnnotatorInput } from "@/features/Annotator";

export const ZoomButton: React.FC = () => {
  const { zoom, zoomInLevel, zoomOutLevel, zoomIn, zoomOut } = useAnnotatorInput();

  if (!zoomInLevel && !zoomOutLevel) return <Fragment/>
  return <Fragment>
    <MdZoomOut className={ [ styles.zoom, zoomOutLevel ? '' : styles.disabled ].join(' ') }
               onClick={ () => zoomOut() }/>
    <MdZoomIn className={ [ styles.zoom, zoomInLevel ? '' : styles.disabled ].join(' ') }
              onClick={ () => zoomIn() }/>
    <p>{ zoom }x</p>
  </Fragment>
}
