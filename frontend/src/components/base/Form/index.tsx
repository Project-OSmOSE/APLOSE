import React, { useMemo } from 'react';
import { Form as BaseForm, type FormProps as BaseProps } from '@base-ui/react';
import type { ErrorType } from '@/api/types.gql-generated';
import styles from './Form.module.scss'
import { cleanGqlErrors } from '@/api/utils';
import { Note } from '@/components/base';

export type FormProps = Omit<BaseProps, 'className'> & {
    className?: string
    horizontal?: boolean
    center?: boolean
    gqlErrors?: (ErrorType | null)[] | null
};

export const Form: React.FC<FormProps> = React.memo(({
                                                         className,
                                                         horizontal,
                                                         center,
                                                         gqlErrors,
                                                         errors,
                                                         children,
                                                         ...props
                                                     }) => {
    const computedErrors = useMemo(() => errors || cleanGqlErrors(gqlErrors), [ errors, gqlErrors ])

    const classes = useMemo(() => {
        const classes = [ styles.Form ]
        if (horizontal) classes.push(styles.horizontal)
        if (center) classes.push(styles.center)
        if (className) classes.push(className)
        return classes
    }, [ className, horizontal, center ])

    return <BaseForm className={ classes.join(' ') }
                     errors={ computedErrors }
                     { ...props }>
        { children }
        { computedErrors?.__all__ && <Note color="danger">{ computedErrors?.__all__ }</Note> }
    </BaseForm>
})