import React from 'react';
import { InfoCircle } from '@solar-icons/react';
import { Dialog, HelpButton } from '@/components/base';
import { ACCEPT_CSV_SEPARATOR, IMPORT_ANNOTATIONS_COLUMNS } from '@/consts/csv';

export const Guidelines: React.FC = () => (
    <Dialog.Root>
        <Dialog.Trigger>
            Guidelines <InfoCircle weight="Linear" size={ 20 }/>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Content alert>
                <Dialog.Title>Annotation import guidelines</Dialog.Title>

                <p>
                    The file should have the following columns:
                    <ul>
                        { IMPORT_ANNOTATIONS_COLUMNS.required.map((c, i) => (
                            <li key={ i }><b>{ c }</b></li>
                        )) }
                    </ul>
                </p>

                <p>The file can have additional optional columns:
                    <ul>
                        { IMPORT_ANNOTATIONS_COLUMNS.optional.map(c => (
                            <li key={ c }><b>{ c }</b></li>)) }
                    </ul>
                </p>

                <p>The accepted separator is: <b>{ ACCEPT_CSV_SEPARATOR }</b></p>

                <HelpButton url="/doc/user/annotation-campaign/import-annotations"/>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
)