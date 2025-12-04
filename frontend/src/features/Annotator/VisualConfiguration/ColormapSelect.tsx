import React, { Fragment, useCallback, useMemo } from 'react';
import { Select } from '@/components/form';
import { Colormap, COLORMAPS } from './colormaps';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { setColormap } from './slice';
import { selectCanChangeColormap, selectColormap } from './selectors';


export const ColormapSelect: React.FC = () => {
  const colormap = useAppSelector(selectColormap);
  const canChangeColormap = useAppSelector(selectCanChangeColormap);
  const dispatch = useAppDispatch();

  const options = useMemo(() => Object.keys(COLORMAPS).map(colormap => ({
    value: colormap, label: colormap, img: `/app/images/colormaps/${ colormap.toLowerCase() }.png`,
  })), [ COLORMAPS ])

  const set = useCallback((value?: Colormap) => dispatch(setColormap(value)), [])

  if (!canChangeColormap) return <Fragment/>
  return <Select required={ true }
                 value={ colormap }
                 placeholder="Select a colormap"
                 onValueSelected={ value => set(value as Colormap) }
                 optionsContainer="popover"
                 options={ options }/>
}
