import React, { type ReactNode } from 'react';
import { Toast } from '@base-ui/react'
import { useToastManager } from './manager.hook'
import styles from './Toast.module.scss'
import { CloseSquare } from '@solar-icons/react';
import { Button } from '@/components/base/Button';


export const Provider: React.FC<{ children: ReactNode }> = React.memo(({ children }) => (
    <Toast.Provider>
        { children }
        <Toast.Portal>
            <Toast.Viewport aria-label="Toast region" className={ styles.Viewport }>
                <ToastList/>
            </Toast.Viewport>
        </Toast.Portal>
    </Toast.Provider>
))

const ToastList: React.FC = () => {
    const { toasts } = useToastManager();

    return toasts.map((toast) => {
        const rootClasses = [ styles.Root ]
        if (toast.type) rootClasses.push(styles[toast.type])
        return <Toast.Root key={ toast.id } toast={ toast } className={ rootClasses.join(' ') }>
            <Toast.Content className={ styles.Content }>
                <Toast.Title className={ styles.Title }/>
                <Toast.Description render={ <div/> } className={ styles.Description }/>
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ }
                <Toast.Action className={ styles.Action } render={ ({ ref, color, ...props }) => <>
                    <Button color={ toast.type } { ...props }/>
                </> }/>
                <Toast.Close className={ styles.Close }>
                    <CloseSquare weight="Bold" size={ 20 }/>
                </Toast.Close>
            </Toast.Content>
        </Toast.Root>
    })
}