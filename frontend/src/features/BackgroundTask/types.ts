import { TaskStatusEnum, TaskTypeEnum } from '@/api';


export type ImportAnalysisBackgroundTask = {
    identifier: string
    requested_by_id: number
    created_at: string
    type: TaskTypeEnum.AnalysisImport
    duration: number
    other_info: {
        dataset_id: number
        analysis_path: string
        analysis_id?: number,
        total_spectrograms?: number,
        completed_spectrograms: number
        chunk_size: number
    }
    celery_id: string | number
    started_at: string
    started_at_completion: number // [0;1]
    completion_percentage: number // [0;1]
    status: TaskStatusEnum
    error: string
    error_trace: string
}

export type BackgroundTask = ImportAnalysisBackgroundTask // | OtherBackgroundTask

export type Event = {
    type: 'info',
    identifier: string,
    data: BackgroundTask
}

export type Command = 'subscribe' | 'unsubscribe' | 'retry'

export type CommandData = {
    command: Command
    token: string
    identifier: string
}
