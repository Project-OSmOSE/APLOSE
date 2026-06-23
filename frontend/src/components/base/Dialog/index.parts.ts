import { Dialog, DialogRootActions } from '@base-ui/react/dialog'

export const Root = Dialog.Root
export type RootActions = DialogRootActions
export * from './Trigger'

export const Portal = Dialog.Portal
export * from './Content'
export * from './Title'
export * from './Close'
export * from './CloseIcon'
export const Description = Dialog.Description

export const createHandle = Dialog.createHandle

