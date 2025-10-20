import React from 'react';
import { Outlet } from 'react-router-dom';
import { useNavParams } from '@/features/UX';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import styles from './layout.module.scss';

export const AploseSkeleton: React.FC = () => {
  const { spectrogramID } = useNavParams()

  if (spectrogramID) return <Outlet/>
  return (
    <div className={ styles.skeleton }>

      <Navbar className={ styles.navbar }/>

      <div className={ styles.content }>
        <Outlet/>
      </div>

      <Footer/>
    </div>
  )
}
