import React from 'react';
import { Toggle } from '@/components/base';

export type ContactType = 'Person' | 'Team' | 'Institution'

const ALL_TYPES = [
    'Person',
    'Team',
    'Institution',
]
export const ContactTypeToggle: React.FC<Omit<Toggle.RadioGroupProps<ContactType>, 'items' | 'itemToElementLabel' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) => {
    return <Toggle.Group { ...props }>
        { ALL_TYPES.map((t, k) =>
            <Toggle.Item key={ k }
                         color="primary"
                         value={ t }
                         children={ t }/>) }
    </Toggle.Group>
}
