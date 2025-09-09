import React from 'react';
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import './css/bootstrap-4.1.3.min.css';
import '@ionic/react/css/core.css';
import './css/ionic-override.css';
import './css/annotation-colors.css';
import './css/app.css';

import { IonApp, setupIonicReact } from '@ionic/react';

import { AppStore, useAppSelector } from "@/service/app";

import { AnnotationCampaignList } from "@/view/annotation-campaign";
import { AnnotationCampaignDetail, AnnotationCampaignInfo } from "@/view/annotation-campaign/[campaignID]";
import { AnnotationCampaignPhaseDetail } from "@/view/annotation-campaign/[campaignID]/phase/[phaseType]";
import { EditAnnotators } from "@/view/annotation-campaign/[campaignID]/phase/[phaseType]/edit-annotators";
import { AnnotatorPage } from "@/view/annotation-campaign/[campaignID]/phase/[phaseType]/spectrogram/[spectrogramID]";
import { NewAnnotationCampaign } from "@/view/annotation-campaign/new";

import { DatasetList } from '@/view/dataset';
import { DatasetDetail } from '@/view/dataset/[datasetID]';

import { Account } from '@/view/account'

import { SqlQuery } from '@/view/admin/sql'
import { OntologyPage } from '@/view/admin/ontology'
import { OntologyTab } from "@/view/admin/ontology/[type]";
import { OntologyPanel } from "@/view/admin/ontology/[type]/[id]";


import { Home } from "@/view/home/Home.tsx";
import { Login } from '@/view/auth';
import { useLoadEventService } from "@/service/events";
import { AlertProvider } from "@/service/ui/alert";
import { AploseSkeleton } from "@/components/layout";
import { selectIsConnected } from "@/service/slices/auth.ts";
import { ReactFlowProvider } from "@xyflow/react";
import { selectCurrentUser } from "@/service/api/user.ts";


setupIonicReact({
  mode: 'md',
  spinner: 'crescent',
});

export const App: React.FC = () => (
  <Provider store={ AppStore }>
    <AlertProvider>
      <ReactFlowProvider>
        <IonApp>
          <BrowserRouter basename='/app/'>
            <AppContent/>
          </BrowserRouter>
        </IonApp>
      </ReactFlowProvider>
    </AlertProvider>
  </Provider>
)

const AppContent: React.FC = () => {
  useLoadEventService();

  const isConnected = useAppSelector(selectIsConnected)
  const currentUser = useAppSelector(selectCurrentUser)

  const from = useLocation()

  return (
    <Routes>

      <Route index element={ <Home/> }/>
      <Route path='login' element={ <Login/> }/>

      { isConnected && <Route element={ <AploseSkeleton/> }>

          <Route path='dataset'>
              <Route index element={ <DatasetList/> }/>
              <Route path=':datasetID' element={ <DatasetDetail/> }/>
          </Route>

          <Route path='annotation-campaign'>
              <Route index element={ <AnnotationCampaignList/> }/>
              <Route path='new' element={ <NewAnnotationCampaign/> }/>
              <Route path=':campaignID'>
                  <Route element={ <AnnotationCampaignDetail/> }>
                      <Route index element={ <AnnotationCampaignInfo/> }/>
                      <Route path='phase/:phaseType' element={ <AnnotationCampaignPhaseDetail/> }/>
                  </Route>
                  <Route path='phase/:phaseType'>
                      <Route path='edit-annotators' element={ <EditAnnotators/> }/>
                    {/*<Route path='import-annotations' element={ <ImportAnnotations/> }/>*/ }
                      <Route path='spectrogram/:spectrogramID' element={ <AnnotatorPage/> }/>
                  </Route>
              </Route>
          </Route>

          <Route path='account' element={ <Account/> }/>

        { currentUser?.is_superuser &&
            <Route path='admin'>
                <Route path='sql' element={ <SqlQuery/> }/>
                <Route path='ontology' element={ <OntologyPage/> }>
                    <Route path=':type'>
                        <Route index element={ <OntologyTab/> }/>
                        <Route path=':id' element={ <OntologyPanel/> }/>
                    </Route>
                </Route>
            </Route> }

          <Route path="" element={ <Navigate to="/annotation-campaign" replace state={ { from } }/> }/>
      </Route> }

      <Route path="*" element={ <Navigate to="/login" replace state={ { from } }/> }/>
    </Routes>
  )
}

export default App;
