import React, { type FormEvent, ReactNode, useCallback } from 'react';
import styles from './ui.module.scss';
import { Input } from '@/components/base/Input';
import type { BaseUIEvent } from '@base-ui/react';
import { Form } from '@/components/base/Form';

export const ActionBar: React.FC<{
    search?: string;
    searchPlaceholder?: string;
    onSearchChange(search?: string): void;
    actionButton: ReactNode;
    children?: ReactNode;
}> = ({ search, searchPlaceholder = 'Search', onSearchChange, actionButton, children }) => {
    const onSubmit = useCallback((event: BaseUIEvent<FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSearchChange(formData.get('search') as string);
    }, [ onSearchChange ])

    return <div className={ styles.actionBar }>
        <Form onSubmit={ onSubmit } horizontal>
            <Input name="search"
                   defaultValue={ search }
                   placeholder={ searchPlaceholder }
                   type="search"
                   className={ styles.search }/>
        </Form>

        { actionButton }

        { children && <div className={ styles.filters }>{ children }</div> }
    </div>
}