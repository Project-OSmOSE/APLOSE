import React, { Fragment } from 'react';
import { Checkbox, Field } from '@/components/base';

import { useImportShortAcquisitionContext } from './Root';


export const Specifications: React.FC = () => {
    const {
        hasRecorderSpecification, setHasRecorderSpecification,
        hasDetectorSpecification, setHasDetectorSpecification,
    } = useImportShortAcquisitionContext()

    return <Fragment>
        <Field.Root horizontal>
            <Field.Label>Include recordings</Field.Label>
            <Checkbox checked={ hasRecorderSpecification } onCheckedChange={ setHasRecorderSpecification }/>
        </Field.Root>
        <Field.Root horizontal>
            <Field.Label>Include detections</Field.Label>
            <Checkbox checked={ hasDetectorSpecification } onCheckedChange={ setHasDetectorSpecification }/>
        </Field.Root>
    </Fragment>
}