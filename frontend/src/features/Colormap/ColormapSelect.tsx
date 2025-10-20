import React, { useCallback, useMemo } from "react";
import { Colormap, COLORMAPS } from "./const";
import { Select } from "@/components/form";

export const ColormapSelect: React.FC<{
  placeholder: string,
  selected?: Colormap,
  onSelect: (color: Colormap) => void,
}> = ({ placeholder, selected, onSelect }) => {

  const options = useMemo(() => Object.keys(COLORMAPS).map(colormap => ({
    value: colormap, label: colormap, img: `/app/images/colormaps/${ colormap.toLowerCase() }.png`
  })), [ COLORMAPS ])

  const onColormapSelected = useCallback((value?: number | string) => {
    onSelect(value as Colormap)
  }, [ onSelect ])

  return <Select required={ true }
                 value={ selected }
                 placeholder={ placeholder }
                 onValueSelected={ onColormapSelected }
                 optionsContainer="popover"
                 options={ options }/>
}