import React, { type FormEvent, useCallback } from 'react';
import { AnnotationTaskStatus } from '@/api';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { Dialog } from '@/components/base/Dialog';
import type { BaseUIEvent } from '@base-ui/react';
import type { AllSpectrogramsFilters } from '@/features/AnnotationSpectrogram';
import { Form } from '@/components/base/Form';
import { ButtonGroup } from '@/components/base/Button';
import { Field } from '@/components/base/Field';
import { Toggle } from '@/components/base/Toggle';
import { Checkbox } from '@/components/base/Checkbox';

export const StatusFilterModal: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })
    const { status, onlyAssigned } = Route.useSearch({
        select: ({ status, onlyAssigned }) => ({
            status,
            onlyAssigned,
        }),
    });
    const routeParams = Route.useParams()
    const navigate = useNavigate();

    const update = useCallback((data: Pick<AllSpectrogramsFilters, 'onlyAssigned' | 'status'>) => {
        navigate({
            to: Route.to,
            params: routeParams,
            search: (prev) => ({
                ...prev,
                ...data,
                page: 1,
            }),
            replace: true,
        })
    }, [ navigate, routeParams ])

    const onSubmit = useCallback((event: BaseUIEvent<FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        update({
            status: formData.get('status') as AnnotationTaskStatus || undefined,
            onlyAssigned: formData.get('onlyAssigned') !== undefined ? formData.get('onlyAssigned') === 'true' : undefined,
        })
    }, [ update ])

    const onReset = useCallback((event: BaseUIEvent<FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        update({
            status: undefined,
            onlyAssigned: undefined,
        })
    }, [ update ])

    return <Dialog.Content>
        <Form onSubmit={ onSubmit } onReset={ onReset }>
            <Field.Root name="status" horizontal>
                <Field.Label>Status</Field.Label>
                <Toggle.Group defaultValue={ status ?? null }>
                    <Toggle.Item color='medium' value={ null }>Unset</Toggle.Item>
                    <Toggle.Item value={ AnnotationTaskStatus.Created }>Created</Toggle.Item>
                    <Toggle.Item value={ AnnotationTaskStatus.Finished }>Finished</Toggle.Item>
                </Toggle.Group>
            </Field.Root>

            { user.isAdmin &&
                <Field.Root name="onlyAssigned" horizontal>
                    <Field.Label>Display only assigned tasks</Field.Label>

                    <Checkbox defaultChecked={ onlyAssigned ?? undefined }/>
                </Field.Root> }

            <ButtonGroup spaceBetween>
                <Dialog.Close type="reset">Reset</Dialog.Close>
                <Dialog.Close type="submit" color="primary">Filter</Dialog.Close>
            </ButtonGroup>
        </Form>
    </Dialog.Content>
}