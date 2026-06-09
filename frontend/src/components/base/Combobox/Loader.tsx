import React from 'react';
import styles from './Combobox.module.scss'
import { IonSpinner } from '@ionic/react';


export const Loader: React.FC = () => (
    <IonSpinner className={ styles.Loader }/>
)
