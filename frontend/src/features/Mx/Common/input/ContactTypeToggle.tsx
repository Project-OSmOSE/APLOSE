import React from 'react';
import { Toggle } from '@/components/base';
import * as API from '../api'

type Props =
    Omit<Toggle.RadioGroupProps<API.ContactTypeEnum>, 'items' | 'itemToElementLabel' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>

const ALL_TYPES: API.ContactTypeEnum[] = [
    API.ContactTypeEnum.Institution,
    API.ContactTypeEnum.Team,
    API.ContactTypeEnum.Person,
]

export const ContactTypeToggle: React.FC<Props> = ({ ...props }) => {
    return <Toggle.Group { ...props }>
        { ALL_TYPES.map(t =>
            <Toggle.Item key={ t } color="primary"
                         value={ t } children={ t }/>) }
    </Toggle.Group>
}
