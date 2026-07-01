import React from 'react';
import styles from './Combobox.module.scss'
import { Spinner } from '@/components/base';


export const Loader: React.FC = () => (
    <Spinner className={ styles.Loader }/>
)