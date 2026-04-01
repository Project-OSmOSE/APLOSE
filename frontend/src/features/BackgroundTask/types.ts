import { type ImportAnalysisBackgroundTaskNode, TaskStatusEnum, TaskTypeEnum } from '@/api';

export type BackgroundTask = ImportAnalysisBackgroundTaskNode

type State<SpecificProcessingData> = {
    status: TaskStatusEnum.Pending | TaskStatusEnum.Cancelled,
    created_at: string,
} | {
    status: TaskStatusEnum.Failed;
    created_at: string,
    error: string,
    error_trace: string,
} | {
    status: TaskStatusEnum.Completed;
    created_at: string,
    started_at: string,
    completed_at: string,
} | ({
    status: TaskStatusEnum.Processing;
    created_at: string,
    started_at: string,
    duration: number,
    completion_percentage: number, // [0-1]
} & SpecificProcessingData)

export type BackgroundTaskUpdateData = {
    id: number,
    requested_by_id: number,
} & ({
    type: TaskTypeEnum.AnalysisImport,
    dataset_id: number,
    analysis_path: string,
    analysis_id?: number | null,
} & State<{ total_spectrograms: number, completed_spectrograms: number, chunk_size: number }>)

export type BackgroundTaskUpdateEvent = {
    type: 'background_task_update',
    data: BackgroundTaskUpdateData
} | {
    type: 'background_task_retry',
    data: {
        old_task_id: number,
        new_task_id: number,
    },
}

export type BackgroundTaskCommandType = 'add' | 'remove' | 'cancel' | 'retry'

export type BackgroundTaskCommand = {
    command: BackgroundTaskCommandType,
    task_id: string
}