import React, { useCallback, useMemo } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query';
import type { BaseUIEvent } from '@base-ui/react';

import type { SourceNode } from '@/api';
import { queryClient } from '@/api/queryClient';
import { Ontology } from '@/features';
import type { UpdateSoundMutationVariables } from '@/features/Ontology';

import { Button, ButtonGroup } from '@/components/base/Button';
import { Spinner } from '@/components/base/Spinner';
import { Form } from '@/components/base/Form';
import { Fieldset } from '@/components/base/Fieldset';
import { Field } from '@/components/base/Field';

import styles from './$type.$id.module.scss';

const OntologyPanel: React.FC = () => {
    const { type, id } = Route.useParams({ select: ({ type, id }) => ({ type, id }) });

    const { data: source, isFetching: isFetchingSource } = useQuery({
        ...Ontology.API.sourceByIdQuery({ id }),
        enabled: type === 'source',
    });
    const { data: sound, isFetching: isFetchingSound } = useQuery({
        ...Ontology.API.soundByIdQuery({ id }),
        enabled: type === 'sound',
    });

    const { mutateAsync: updateSource } = useMutation(Ontology.API.updateSourceMutation)
    const { mutateAsync: updateSound } = useMutation(Ontology.API.updateSoundMutation)

    const isFetching = useMemo(() => isFetchingSound || isFetchingSource, [ isFetchingSource, isFetchingSound ])
    const data = useMemo(() => type == 'source' ? source : sound, [ type, source, sound ])

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        if (!data) return;
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const info: UpdateSoundMutationVariables = {
            id: data.id,
            parent_id: data.parent?.id,
            englishName: formData.get('englishName') as string || data.englishName,
            frenchName: formData.get('frenchName') as string || data.frenchName,
            codeName: formData.get('codeName') as string || data.codeName,
            taxon: formData.get('taxon') as string || data.taxon,
        }

        switch (type) {
            case 'source':
                return updateSource({
                    ...info,
                    latinName: formData.get('latinName') as string || (data as SourceNode).latinName,
                })
            case 'sound':
                return updateSound(info)
        }
    }, [type, data, updateSource, updateSound]);

    if (!id) return <div className={ styles.panel }/>
    return <div className={ styles.panel }>
        { isFetching && <Spinner/> }

        { !isFetching && data && <Form onSubmit={ submit }>
            <Fieldset.Root>
                <Fieldset.Legend>ID: { data.id }</Fieldset.Legend>

                <Field.Root name='englishName'>
                    <Field.Label required>English name</Field.Label>
                    <Field.Control type="text" placeholder={ data.englishName }/>
                    <Field.Error/>
                </Field.Root>

                { type === 'source' && <Field.Root name='latinName'>
                    <Field.Label>Latin name</Field.Label>
                    <Field.Control type="text" placeholder={ (data as SourceNode).latinName ?? undefined }/>
                    <Field.Error/>
                </Field.Root> }

                <Field.Root name='frenchName'>
                    <Field.Label>French name</Field.Label>
                    <Field.Control type="text" placeholder={ data.frenchName ?? undefined }/>
                    <Field.Error/>
                </Field.Root>

                <Field.Root name='codeName'>
                    <Field.Label>Code name</Field.Label>
                    <Field.Control type="text" placeholder={ data.codeName ?? undefined }/>
                    <Field.Error/>
                </Field.Root>

                <Field.Root name='taxon'>
                    <Field.Label>Taxon</Field.Label>
                    <Field.Control type="text" placeholder={ data.taxon ?? undefined }/>
                    <Field.Error/>
                </Field.Root>

            </Fieldset.Root>

            <ButtonGroup spaceBetween>
                <Button type="reset">
                    Reset
                </Button>
                <Button type="submit" color="primary">
                    Save
                </Button>
            </ButtonGroup>
        </Form> }
    </div>
}

export const Route = createFileRoute('/_authenticated/_superuser/ontology/$type/$id')({
    beforeLoad: ({ params }) => {
        const { type, id } = params
        if (!id) throw notFound()
        return { type: type as 'source' | 'sound', id: id as string }
    },
    loader: ({ params: { type, id } }) => {
        switch (type) {
            case 'source':
                return queryClient.ensureQueryData(Ontology.API.sourceByIdQuery({ id }))
            case 'sound':
                return queryClient.ensureQueryData(Ontology.API.soundByIdQuery({ id }))
        }
    },
    component: OntologyPanel,
})
