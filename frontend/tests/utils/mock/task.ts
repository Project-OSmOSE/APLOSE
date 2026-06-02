import type { GqlQuery } from './_types';
import type { SubmitTaskMutation } from '../../../src/features/AnnotationTask';
import type {
    AllAnnotationSpectrogramsQuery,
    GetAnnotationSpectrogramPathsQuery,
    GetAnnotationSpectrogramQuery,
} from '../../../src/features/AnnotationSpectrogram';
import {
    AUDIO_PATH,
    boxAnnotation,
    CONFIDENCES,
    dataset,
    LABELS,
    otherPhase,
    phase,
    spectrogram,
    SPECTROGRAM_PATH,
    taskComment,
    TASKS,
    USERS,
    weakAnnotation,
    weakAnnotationComment,
} from './types';


export const TASK_QUERIES: {
    allAnnotationSpectrograms: GqlQuery<AllAnnotationSpectrogramsQuery>,
    getAnnotationSpectrogram: GqlQuery<GetAnnotationSpectrogramQuery, 'submitted' | 'submittedAsOwner' | 'unsubmitted'>,
    getAnnotationSpectrogramPaths: GqlQuery<GetAnnotationSpectrogramPathsQuery>,
} = {
    allAnnotationSpectrograms: {
        defaultType: 'filled',
        empty: {
            allAnnotationSpectrograms: null,
        },
        filled: {
            allAnnotationSpectrograms: {
                results: Object.values(TASKS).map(t => ({
                    id: t.id,
                    start: spectrogram.start,
                    filename: spectrogram.filename,
                    duration: spectrogram.duration,
                    isAssigned: true,
                    task: {
                        status: t.status,
                        annotations: {
                            totalCount: t.annotationCount,
                        },
                        validatedAnnotations: {
                            totalCount: t.validationAnnotationCount,
                        },
                    },
                })),
                totalCount: 2,
                resumeSpectrogramId: spectrogram.id,
            },
        },
    },
    getAnnotationSpectrogram: {
        defaultType: 'unsubmitted',
        empty: {
            allAnnotationSpectrograms: null,
            annotationSpectrogramById: null,
        },
        submitted: {
            allAnnotationSpectrograms: {
                totalCount: dataset.spectrogramCount,
                nextSpectrogramId: (+TASKS.submitted.id + 1)?.toString(),
                previousSpectrogramId: (+TASKS.submitted.id - 1)?.toString(),
                currentIndex: 2,
            },
            annotationSpectrogramById: {
                id: TASKS.submitted.id,
                start: spectrogram.start,
                filename: spectrogram.filename,
                duration: spectrogram.duration,
                isAssigned: true,
                task: {
                    status: TASKS.submitted.status,
                    userAnnotations: {
                        results: [
                            {
                                ...weakAnnotation,
                                annotationPhase: { id: phase.id },
                                annotator: {
                                    id: USERS.annotator.id,
                                    displayName: USERS.annotator.displayName,
                                },
                                label: {
                                    name: LABELS.classic.name,
                                },
                                confidence: {
                                    label: CONFIDENCES.sure.label,
                                },
                                comments: {
                                    results: [ weakAnnotationComment ],
                                },
                            },
                            {
                                ...boxAnnotation,
                                annotationPhase: { id: phase.id },
                                annotator: {
                                    id: USERS.annotator.id,
                                    displayName: USERS.annotator.displayName,
                                },
                                label: {
                                    name: LABELS.classic.name,
                                },
                                confidence: {
                                    label: CONFIDENCES.notSure.label,
                                },
                                comments: null,
                            },
                        ],
                    },
                    userComments: {
                        results: [ taskComment ],
                    },
                },
            },
        },
        submittedAsOwner: {
            allAnnotationSpectrograms: {
                totalCount: dataset.spectrogramCount,
                nextSpectrogramId: (+TASKS.submitted.id + 1)?.toString(),
                previousSpectrogramId: (+TASKS.submitted.id - 1)?.toString(),
                currentIndex: 2,
            },
            annotationSpectrogramById: {
                id: TASKS.submitted.id,
                start: spectrogram.start,
                filename: spectrogram.filename,
                duration: spectrogram.duration,
                isAssigned: true,
                task: {
                    status: TASKS.submitted.status,
                    userAnnotations: {
                        results: [
                            {
                                ...weakAnnotation,
                                annotationPhase: { id: otherPhase.id },
                                annotator: {
                                    id: USERS.creator.id,
                                    displayName: USERS.creator.displayName,
                                },
                                label: {
                                    name: LABELS.classic.name,
                                },
                                confidence: {
                                    label: CONFIDENCES.sure.label,
                                },
                                comments: {
                                    results: [ weakAnnotationComment ],
                                },
                            },
                            {
                                ...boxAnnotation,
                                annotationPhase: { id: otherPhase.id },
                                annotator: {
                                    id: USERS.creator.id,
                                    displayName: USERS.creator.displayName,
                                },
                                label: {
                                    name: LABELS.classic.name,
                                },
                                confidence: {
                                    label: CONFIDENCES.notSure.label,
                                },
                                comments: null,
                            },
                        ],
                    },
                    userComments: {
                        results: [ taskComment ],
                    },
                },
            },
        },
        unsubmitted: {
            allAnnotationSpectrograms: {
                totalCount: dataset.spectrogramCount,
                nextSpectrogramId: (+TASKS.unsubmitted.id + 1)?.toString(),
                previousSpectrogramId: null,
                currentIndex: 1,
            },
            annotationSpectrogramById: {
                id: TASKS.unsubmitted.id,
                start: spectrogram.start,
                filename: spectrogram.filename,
                duration: spectrogram.duration,
                isAssigned: true,
                task: {
                    status: TASKS.unsubmitted.status,
                    userAnnotations: null,
                    userComments: null,
                },
            },
        },
    },
    getAnnotationSpectrogramPaths: {
        defaultType: 'filled',
        empty: {
            spectrogramPaths: null,
        },
        filled: {
            spectrogramPaths: {
                spectrogramPath: SPECTROGRAM_PATH,
                audioPath: AUDIO_PATH,
            },
        },
    },
}

export const TASK_MUTATIONS: {
    submitTask: GqlQuery<SubmitTaskMutation, never>
} = {
    submitTask: {
        defaultType: 'empty',
        empty: {},
    },
}
