import React, { Fragment } from 'react';
import { ComboboxSelect, type ComboboxSelectProps, Note } from '@/components/base'
import { type Colormap, COLORMAP_LIST } from '../const';
import styles from './Colormap.module.scss'

export const Select: React.FC<Omit<ComboboxSelectProps<Colormap>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName="colormap"
                    items={ COLORMAP_LIST }
                    itemToStringLabel={ item => item }
                    itemToStringValue={ item => item }
                    itemToElementValue={ item => item ? <div className={ styles.SelectItem }>
                        <img src={ `/app/images/colormaps/${ item.toLowerCase() }.png` } alt={ item }/>
                        <Note color="medium">{ item }</Note>
                    </div> : <Fragment/> }
                    isItemEqualToValue={ (a, b) => a === b }
                    { ...props }/>
