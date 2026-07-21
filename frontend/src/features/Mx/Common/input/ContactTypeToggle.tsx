import React, { Fragment, useMemo } from 'react';
import { Spinner, Toggle } from '@/components/base';
import { useQuery } from '@tanstack/react-query';
import * as API from '../api'

type Props =
    Omit<Toggle.RadioGroupProps<API.ContactTypeFragment>, 'items' | 'itemToElementLabel' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>
    & { defaultModel?: API.ContactType }

export const ContactTypeToggle: React.FC<Props> = ({ defaultModel, defaultValue, value, ...props }) => {
    const { data: types, isFetching } = useQuery(API.contactTypesQuery)

    const _defaultValue = useMemo(() => {
        if (defaultValue) return defaultValue;
        return types?.find(t => t.model === defaultModel)
    }, [ defaultModel, defaultValue, types ]);

    if (isFetching) return <Spinner/>;
    if (defaultModel && !_defaultValue) return <Fragment/>;
    return <Toggle.Group defaultValue={ _defaultValue }
                         value={ value || _defaultValue }
                         { ...props }>
        { types?.map(t =>
            <Toggle.Item key={ t.id }
                         color="primary"
                         value={ t }
                         children={ t.model }/>) }
    </Toggle.Group>
}
