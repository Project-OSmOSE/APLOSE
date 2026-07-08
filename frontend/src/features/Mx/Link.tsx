import React from 'react';
import { Link as BaseLink } from '@/components/base';
import styles from './Mx.module.scss'

export const Link: React.FC = () => (
    <BaseLink to="/mx"
              className={ styles.Link }
              children="MetadataX"/>
)
