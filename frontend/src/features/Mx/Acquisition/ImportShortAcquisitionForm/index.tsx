import React from 'react';

import { Field, Note } from '@/components/base';

import { ProjectSelect } from '../Project';

import { Root } from './Root'
import { CSVInput } from './CSVInput';
import { FormTable } from './Table';
import { Specifications } from './Specifications';
import { InfoDialog } from './Info';

export const ImportShortAcquisitionForm: React.FC = () => (
    <Root>
        <Note color="medium">
            <InfoDialog/>
            Be sure to have all the ontology labels you could use already registered before filling in this form
        </Note>
        <Field.Root name="project">
            <Field.Label required>Project</Field.Label>
            <ProjectSelect required/>
        </Field.Root>

        <Specifications/>

        <CSVInput/>

        <FormTable/>
    </Root>
)
