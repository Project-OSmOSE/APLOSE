import React, { Fragment } from 'react';
import { useImageSettingsContext } from '@/features/Annotator/ImageSettings/Root';
import { Spinner } from '@/components/base';

export const ImageSettingsUpdateSpinner: React.FC = () => {
    const { isUpdating } = useImageSettingsContext()

    if (isUpdating) return <Spinner/>
    return <Fragment/>
}
