import { AnnotationRestAPI } from './api';
import { useCallback, useState } from 'react';
import { ImportAnnotation } from './types';
import { useParams } from '@tanstack/react-router';
import { Toast } from '@/components/base';
import { getErrorMessage } from '@/service/function';
import { queryClient } from '@/api/queryClient';
import { queryKeys } from '@/api/queryKeys';
import { AnnotationPhaseType } from '@/api/types.gql-generated';

const {
    importAnnotations,
} = AnnotationRestAPI.endpoints

const CHUNK_SIZE = 200;
export const useChunkImportAnnotations = () => {
    const { campaignID } = useParams({ strict: false });
    const [ method ] = importAnnotations.useMutation()
    const toastManager = Toast.useToastManager()

    const [ isUploading, setIsUploading ] = useState<boolean>(false);
    const [ uploaded, setUploaded ] = useState<number>(0);
    const [ uploadDuration, setUploadDuration ] = useState<number>(0); // seconds
    const [ remainingDuration, setRemainingDuration ] = useState<number | undefined>(undefined); // seconds

    const updateUploadDurations = useCallback((newDuration: number, uploaded: number, total: number) => {
        setUploadDuration(newDuration);
        setRemainingDuration(uploaded === 0 ? undefined : (total - uploaded) * newDuration / uploaded);
    }, [])

    const upload = useCallback(async (annotations: ImportAnnotation[]): Promise<boolean> => {
        if (isUploading || !campaignID) return false
        setIsUploading(true)

        let uploadedCount = uploaded
        let start = Date.now()
        let force_datetime = false
        let force_max_frequency = false

        while (uploadedCount < annotations.length) {
            try {
                await method({
                    campaignID,
                    annotations: annotations.slice(uploadedCount, uploadedCount + CHUNK_SIZE),
                    force_datetime, force_max_frequency,
                }).unwrap()
                queryClient.invalidateQueries({
                    queryKey: queryKeys.spectrogram.baseForPhase({
                        campaignID,
                        phaseType: AnnotationPhaseType.Annotation,
                    }),
                })
                uploadedCount += CHUNK_SIZE
                setUploaded(uploadedCount)
                updateUploadDurations(
                    (Date.now() - start) / 1_000,  // transform ms to s
                    uploadedCount,
                    annotations.length,
                )
                uploadedCount += CHUNK_SIZE
                setUploaded(uploadedCount)
            } catch (error) {
                if (!error) continue
                const attributes = Object.getOwnPropertyNames(error)
                const canForceDatetime = attributes.includes('canForceDatetime') && (error as any).canForceDatetime
                const canForceMaxFrequency = attributes.includes('canForceMaxFrequency') && (error as any).canForceMaxFrequency

                const shouldContinue = await new Promise<boolean>(resolve => {
                    const toastOptions: Toast.ToastManagerAddOptions<never> = {
                        type: 'danger',
                        title: 'Annotation import failed',
                        description: getErrorMessage(error),
                        onClose: () => resolve(false),
                    }
                    let id: string | undefined;
                    if (canForceDatetime || canForceMaxFrequency) {
                        toastOptions.actionProps = {
                            children: 'Import anyway',
                            onClick: () => {
                                if (canForceDatetime) force_datetime = true
                                if (canForceMaxFrequency) force_max_frequency = true
                                resolve(true)
                                toastManager.close(id)
                            },
                        }
                    }
                    toastManager.add(toastOptions)
                })
                setIsUploading(false);
                if (!shouldContinue) return false
            } finally {
                start = Date.now()
            }
        }

        setIsUploading(false);
        toastManager.add({
            type: 'success',
            title: 'Annotation import succeed',
            description: 'Your annotations has beeen imported.',
        })
        return true
    }, [ uploaded, toastManager, importAnnotations, campaignID ])

    return {
        isUploading,
        uploaded,
        uploadDuration,
        remainingDuration,
        upload,
    }
}
