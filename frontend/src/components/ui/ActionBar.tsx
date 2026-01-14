import React, { ReactNode } from 'react';
import { Searchbar } from '@/components/form';
import styles from './ui.module.scss';

export const ActionBar: React.FC<{
  search?: string;
  searchPlaceholder?: string;
  onSearchChange(search?: string): void;
  actionButton: ReactNode;
  children?: ReactNode;
}> = ({ search, searchPlaceholder = 'Search', onSearchChange, actionButton, children }) => (
  <div className={ styles.actionBar }>
    <Searchbar placeholder={ searchPlaceholder }
               onChange={ onSearchChange }
               search={ search }
               className={ styles.search }/>

    { actionButton }

    { children && <div className={ styles.filters }>{ children }</div> }
  </div>
)