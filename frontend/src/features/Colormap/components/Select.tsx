import React from 'react';

import { Combobox, ComboboxRootProps } from '@/components/base/Combobox'
import { type Colormap, COLORMAP_LIST } from '../const';

import styles from './Colormap.module.scss'
import { Note } from '@/components/base/Note';

type RootProps = ComboboxRootProps<Colormap, false>
const ComboboxRoot: React.FC<RootProps> = (props) => <Combobox.Root { ...props }/>

type ColormapSelectProps =
    Omit<RootProps, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'>
    & { id?: string }
export const Select: React.FC<ColormapSelectProps> = ({ id, ...props }) => (
    <ComboboxRoot items={ COLORMAP_LIST }
                  itemToStringValue={ (itemValue: Colormap) => itemValue }
                  itemToStringLabel={ (itemValue: Colormap) => itemValue }
                  isItemEqualToValue={ (itemValue: Colormap, value: Colormap) => itemValue == value }
                  { ...props }>

        <Combobox.InputGroup>
            <Combobox.Input placeholder="Select a colormap" id={ id }/>
            <Combobox.Clear/>
            <Combobox.Trigger/>
        </Combobox.InputGroup>
        <Combobox.Value>
            { (item: Colormap) => (
                item && <img className={ styles.SelectValue }
                             src={ `/app/images/colormaps/${ item.toLowerCase() }.png` }
                             alt={ item }/>
            ) }
        </Combobox.Value>

        <Combobox.Portal>
            <Combobox.Positioner side="top">
                <Combobox.Popup data-testid="colormap-select-popup">
                    <Combobox.Empty>No colormap found.</Combobox.Empty>
                    <Combobox.List>
                        { (item: Colormap) => (
                            <Combobox.Item key={ item } value={ item }>
                                <Combobox.ItemIndicator/>
                                <div className={ styles.SelectItem }>
                                    <img src={ `/app/images/colormaps/${ item.toLowerCase() }.png` } alt={ item }/>
                                    <Note color="medium">{ item }</Note>
                                </div>
                            </Combobox.Item>
                        ) }
                    </Combobox.List>
                </Combobox.Popup>
            </Combobox.Positioner>
        </Combobox.Portal>
    </ComboboxRoot>
)