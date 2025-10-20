import React, { ReactNode } from 'react';
import styles from './ui.module.scss'

export const Bloc: React.FC<{
  header: ReactNode | string,
  children: ReactNode,
  className?: string,
  bodyClassName?: string,
  centerBody?: boolean,
  smallSpaces?: boolean,
  vertical?: boolean,
}> = ({ header, children, className, centerBody, smallSpaces, vertical, bodyClassName }) => {
  return <div className={ [ styles.bloc, className ].join(' ') }>
    <h6 className={ styles.header }>
      { header }
    </h6>
    <div className={ [
      styles.body,
      centerBody ? styles.center : '',
      smallSpaces ? styles.smallSpaces : '',
      vertical ? styles.vertical : '',
      bodyClassName,
    ].join(' ') } children={ children }/>
  </div>
}