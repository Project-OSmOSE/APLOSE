import React, { useCallback, useMemo, useState } from 'react';
import { createFileRoute, useLoaderData, useParams, useRouter } from '@tanstack/react-router';
import type { BaseUIEvent } from '@base-ui/react';

import { useChunkImportAnnotations } from '@/api';
import { cleanGqlList } from '@/api/utils';
import { AnnotationPhaseType } from '@/api/types.gql-generated';

import { Head } from '@/components/ui';
import { Content } from '@/components/layout/Content';
import { Button, ButtonGroup, Form, Note, Progress, Spinner, Toast } from '@/components/base';

import { ImportFileFormBloc } from './(components)/-ImportFileFormBloc';
import { DetectorsTable } from './(components)/-DetectorsTable';
import { formatTime, pluralize } from '@/service/function';
import { Guidelines } from './(components)/-Guidelines';
import { type Annotation } from './(components)/-type';
import styles from './styles.module.scss'


export const ImportAnnotations: React.FC = () => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phaseType } = useParams({
        from: Route.id,
        select: ({ phaseType }) => ({ phaseType }),
    });
    const {
        upload,
        isUploading,
        remainingDuration,
        uploaded,
    } = useChunkImportAnnotations()
    const router = useRouter()
    const toastManager = Toast.useToastManager()

    const [ file, setFile ] = useState<File | undefined>();
    const [ annotations, setAnnotations ] = useState<Annotation[]>([]);
    const detectorNames = useMemo(() => {
        return [ ...new Set(cleanGqlList(annotations.map(a => a.initial__detector__name))) ]
    }, [ annotations ]);

    const onFileLoaded = useCallback((file: File, annotations: Annotation[]) => {
        setFile(file)
        setAnnotations(annotations)
    }, [])

    const onFileReset = useCallback(() => {
        setFile(undefined)
        setAnnotations([]);
    }, [])

    const [ total, setTotal ] = useState<number>(0);
    const onSubmit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const detectors = detectorNames
            .filter(name => formData.get(`import-${ name }`) == 'true')
            .map(name => {
                const config = formData.getAll(`configuration-${ name }`) as string[]
                return {
                    name,
                    existingName: formData.get(`detector-${ name }`) as string || undefined,
                    configurationText: config.length === 2 && config[1] || config[0],
                }
            })

        const detectorsMissingConfiguration = detectors.filter(d => !d.configurationText)
        if (detectorsMissingConfiguration.length > 0) {
            toastManager.add({
                type: 'warning',
                title: 'Cannot import',
                description: `The following detector${ pluralize(detectorsMissingConfiguration) } need a configuration: ${ detectorsMissingConfiguration.map(d => d.name).join(', ') }.`,
            })
            return
        }

        const annotationsForUpload = annotations
            .map(a => [ a, detectors.find(d => d.name === a.initial__detector__name) ] as const)
            .filter(([ _, d ]) => !!d)
            .map(([ a, d ]) => ({
                ...a,
                detector__name: d!.existingName ?? d!.name,
                detector_configuration__configuration: d!.configurationText,
            }))
        setTotal(annotationsForUpload.length)
        const didUpload = await upload(annotationsForUpload)
        if (didUpload) router.history.back()
    }, [ toastManager, annotations, detectorNames, router, upload ])

    return <Content oneContent>
        <Head title="Import annotations"
              canGoBack
              subtitle={ `${ campaign.name } - ${ phaseType }` }
              buttons={ <Guidelines/> }/>

        <Form className={ styles.Form } onSubmit={ onSubmit }>
            <ImportFileFormBloc onLoaded={ onFileLoaded }
                                onReset={ onFileReset }/>

            <DetectorsTable names={ detectorNames }/>

            { isUploading && <div>
                <Progress value={ uploaded } max={ total } color="primary">
                    Upload
                </Progress>
                <Note color="medium">
                    Estimated remaining time: { formatTime(remainingDuration) }
                </Note>
            </div> }

            <ButtonGroup end>
                { isUploading && <Spinner/> }

                <Button type="submit" disabled={ !file || isUploading }>
                    Import
                </Button>
            </ButtonGroup>
        </Form>

    </Content>
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/import-annotations')({
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    component: ImportAnnotations,
})
