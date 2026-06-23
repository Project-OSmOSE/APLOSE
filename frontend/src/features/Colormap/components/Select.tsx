import React from 'react';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { type Colormap, COLORMAP_LIST } from '../const';

export const Select: React.FC<Omit<ComboboxSelectProps<Colormap>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName="colormap"
                    items={ COLORMAP_LIST }
                    itemToStringLabel={ item => item }
                    itemToStringValue={ item => item }
                    isItemEqualToValue={ (a, b) => a === b }
                    { ...props }/>
