import { Slice } from './Slice'
import { useBrowse, useImportDataset, useSearch } from './hook'

// Components
import { ItemList } from './components/ItemList'
import { ServerItem } from './components/ServerItem'
import { Item } from './components/Item'

// Modals
import { ImportDatasetAnalysisModal } from './modal/ImportDatasetAnalysisModal'
import { ImportFromPathModal } from './modal/ImportFromPathModal'


const Storage = {
    ...Slice,
    useImportDataset, useSearch, useBrowse,

    Item, ItemList, ServerItem,

    ImportDatasetAnalysisModal, ImportFromPathModal,

}
export default Storage
export type * from './types'
export type * from './api'
