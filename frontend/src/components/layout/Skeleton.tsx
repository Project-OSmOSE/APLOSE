import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { type AploseNavParams } from '@/features/UX';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import styles from './layout.module.scss';

export const AploseSkeleton: React.FC = () => {
  const { spectrogramID } = useParams<AploseNavParams>();

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

export default AploseSkeleton
