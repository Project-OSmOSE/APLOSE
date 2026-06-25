import React from 'react';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import type { DetectorConfigurationNode } from '@/api';

export type SelectValue = Pick<DetectorConfigurationNode, 'id' | 'configuration'>
export const ConfigurationSelect: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName="detector configuration"
                    itemToStringLabel={ item => item.configuration }
                    itemToStringValue={ item => item.id }
                    isItemEqualToValue={ (a, b) => a.id === b.id }
                    { ...props }/>
