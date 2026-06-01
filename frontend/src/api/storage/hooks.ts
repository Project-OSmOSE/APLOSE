import { StorageGqlAPI } from './api'

const {
    importDatasetFromStorage,
} = StorageGqlAPI.endpoints

export const useImportDatasetFromStorage = () => {
    const [ method, { isSuccess, ...info } ] = importDatasetFromStorage.useMutation()
    return { isSuccess, ...info, importDataset: method }
}
