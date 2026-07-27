import React from 'react';
import { Toggle } from '@/components/base';
import { ContactTypeEnum } from '@/api';

type Props =
    Omit<Toggle.RadioGroupProps<ContactTypeEnum>, 'items' | 'itemToElementLabel' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>

const ALL_TYPES: ContactTypeEnum[] = [
    ContactTypeEnum.Institution,
    ContactTypeEnum.Team,
    ContactTypeEnum.Person,
]

export const ContactTypeToggle: React.FC<Props> = ({ ...props }) => {
    return <Toggle.Group { ...props }>
        { ALL_TYPES.map(t =>
            <Toggle.Item key={ t } color="primary"
                         value={ t } children={ t }/>) }
    </Toggle.Group>
}
