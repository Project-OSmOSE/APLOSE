import React, { Fragment, useMemo } from "react";
import { Select } from "@/components/form";
import { Colormap, COLORMAPS } from "./colormaps";
import { useAnnotatorVisualConfiguration } from './hooks'


export const ColormapSelect: React.FC = () => {
  const { colormap, setColormap, canChangeColormap } = useAnnotatorVisualConfiguration()

  const options = useMemo(() => Object.keys(COLORMAPS).map(colormap => ({
    value: colormap, label: colormap, img: `/app/images/colormaps/${ colormap.toLowerCase() }.png`
  })), [ COLORMAPS ])

  if (!canChangeColormap) return <Fragment/>
  return <Select required={ true }
                 value={ colormap }
                 placeholder="Select a colormap"
                 onValueSelected={ value => setColormap(value as Colormap) }
                 optionsContainer="popover"
                 options={ options }/>
}
