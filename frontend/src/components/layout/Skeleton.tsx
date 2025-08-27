import React from 'react';
import { Footer, Navbar } from "@/components/layout";
import styles from './layout.module.scss';
import { Outlet, useParams } from "react-router-dom";

export const AploseSkeleton: React.FC = () => {
  const { spectrogramID } = useParams<{ spectrogramID: string }>()

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
