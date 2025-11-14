import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { Head, Tab, Tabs } from '@/components/ui';
import { Outlet, useLocation } from 'react-router-dom';

export const OntologyPage: React.FC = () => {

  const location = useLocation();

  return <Fragment>
    <Head title="Ontology"/>

    <div className={ styles.page }>
      <Tabs>
        <Tab appPath="/admin/ontology/source"
             active={ location.pathname.includes('source') }>
          Sources
        </Tab>
        <Tab appPath="/admin/ontology/sound"
             active={ location.pathname.includes('sound') }>
          Sounds
        </Tab>
      </Tabs>

      <Outlet/>
    </div>

  </Fragment>
}

export default OntologyPage
