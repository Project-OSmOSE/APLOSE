import { RadioGroup, RadioGroupProps as BaseProps } from '@base-ui/react/radio-group';
import styles from './Toggle.module.scss'

export type RadioGroupProps<T> = BaseProps<T>

export function Group<Value>({
                                                                                className,
                                                                                ...props
                                                                            }: RadioGroupProps<Value>) {
    return <RadioGroup className={ [ styles.Group, className ].join(' ') }
                       { ...props }/>
}
