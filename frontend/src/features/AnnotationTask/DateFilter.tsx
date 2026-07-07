import React, { type FormEvent, useCallback } from 'react';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase.$phaseType';
import { useNavigate } from '@tanstack/react-router';
import { ButtonGroup } from '@/components/base/Button';
import { Dialog } from '@/components/base/Dialog';
import { Field } from '@/components/base/Field';
import { Form } from '@/components/base/Form';
import type { BaseUIEvent } from '@base-ui/react';
import type { AllSpectrogramsFilters } from '@/features/AnnotationSpectrogram';


export const DateFilterModal: React.FC = () => {
    const { from, to } = Route.useSearch({ select: ({ from, to }) => ({ from, to }) });
    const routeParams = Route.useParams()
    const navigate = useNavigate();

    const update = useCallback((data: Pick<AllSpectrogramsFilters, 'from' | 'to'>) => {
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
            from: formData.get('from') as string || undefined,
            to: formData.get('to') as string || undefined,
        })
    }, [ update ])

    const onReset = useCallback((event: BaseUIEvent<FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        update({
            from: undefined,
            to: undefined,
        })
    }, [ update ])

    return <Dialog.Content>
        <Form onSubmit={ onSubmit } onReset={ onReset }>
            <Field.Root name="from">
                <Field.Label>Minimum date</Field.Label>
                <Field.Control type="datetime-local"
                               defaultValue={ from ?? undefined }
                               step={ 1 }
                               placeholder="Min date"/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="to">
                <Field.Label>Maximum date</Field.Label>
                <Field.Control type="datetime-local"
                               defaultValue={ to ?? undefined }
                               step={ 1 }
                               placeholder="Max date"/>
                <Field.Error/>
            </Field.Root>

            <ButtonGroup spaceBetween>
                <Dialog.Close type="reset">Reset</Dialog.Close>
                <Dialog.Close type="submit" color="primary">Filter</Dialog.Close>
            </ButtonGroup>
        </Form>
    </Dialog.Content>
}