import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import './css/bootstrap-4.1.3.min.css';
import '@ionic/react/css/core.css';
import './css/ionic-override.css';
import './css/annotation-colors.css';
import './css/app.css';

import { IonApp, setupIonicReact } from '@ionic/react';

import { StoreProvider, useAppSelector } from '@/features/App';

const Login = lazy(() => import('./view/auth/Login'));
const Account = lazy(() => import('./view/account'));
const SqlQuery = lazy(() => import('./view/admin/sql'));
const DatasetList = lazy(() => import('./view/dataset'));
const DatasetDetail = lazy(() => import('./view/dataset/[datasetID]'));
const AnnotationCampaignList = lazy(() => import('./view/annotation-campaign'));
const NewAnnotationCampaign = lazy(() => import('./view/annotation-campaign/new'));
const AnnotationCampaignDetail = lazy(() => import('./view/annotation-campaign/[campaignID]'));
const AnnotationCampaignInfo = lazy(() => import('./view/annotation-campaign/[campaignID]/InfoTab'));
const AnnotationCampaignPhaseDetail = lazy(() => import('./view/annotation-campaign/[campaignID]/phase/[phaseType]'));
const EditAnnotators = lazy(() => import('./view/annotation-campaign/[campaignID]/phase/[phaseType]/edit-annotators'));
const ImportAnnotations = lazy(() => import('./view/annotation-campaign/[campaignID]/phase/[phaseType]/import-annotations'));
const AnnotatorPage = lazy(() => import('./view/annotation-campaign/[campaignID]/phase/[phaseType]/spectrogram/[spectrogramID]'));
const SpectrogramExamplePage = lazy(() => import('./view/spectrogram-example'));
const SoundLibraryPage = lazy(() => import('./view/sound-library'));
const DocumentationPage = lazy(() => import('./view/documentation'));
const OceanSoundApp = lazy(() => import('./view/oceansound'));

const AploseSkeleton = lazy(() => import('./components/layout/Skeleton'));

import { useLoadEventService } from '@/features/UX/Events';
import { AlertProvider } from '@/components/ui/Alert';
import { selectIsConnected } from '@/features/Auth';
import { ReactFlowProvider } from '@xyflow/react';
import { selectCurrentUser } from '@/api';
import { AudioProvider } from '@/features/Audio';


setupIonicReact({
  mode: 'md',
  spinner: 'crescent',
});

export const App: React.FC = () => (
  <StoreProvider>
    <IonApp>
      <BrowserRouter basename="/">
        <AudioProvider>
          <AlertProvider>
            <ReactFlowProvider>
              <AppContent/>
            </ReactFlowProvider>
          </AlertProvider>
        </AudioProvider>
      </BrowserRouter>
    </IonApp>
  </StoreProvider>
)

const AppContent: React.FC = () => {
  useLoadEventService();

  const isConnected = useAppSelector(selectIsConnected)
  const currentUser = useAppSelector(selectCurrentUser)

  const from = useLocation()

  return (
    <Routes>
      {/* Root redirects to OceanSound landing page */}
      <Route index element={ <Navigate to="/oceansound" replace/> }/>

      {/* OceanSound Public Landing Pages */}
      <Route path="oceansound/*" element={ <Suspense><OceanSoundApp/></Suspense> }/>

      {/* APLOSE App Routes */}
      <Route path="app">
        <Route index element={ <Navigate to="/app/login" replace/> }/>
        <Route path="login" element={ <Suspense><Login/></Suspense> }/>

        { isConnected && <Route element={ <Suspense><AploseSkeleton/></Suspense> }>

            <Route path="dataset">
                <Route index element={ <Suspense><DatasetList/></Suspense> }/>
                <Route path=":datasetID" element={ <Suspense><DatasetDetail/></Suspense> }/>
            </Route>

            <Route path="annotation-campaign">
                <Route index element={ <Suspense><AnnotationCampaignList/></Suspense> }/>
                <Route path="new" element={ <Suspense><NewAnnotationCampaign/></Suspense> }/>
                <Route path=":campaignID">
                    <Route element={ <Suspense><AnnotationCampaignDetail/></Suspense> }>
                        <Route index element={ <Suspense><AnnotationCampaignInfo/></Suspense> }/>
                        <Route path="phase/:phaseType" element={ <Suspense><AnnotationCampaignPhaseDetail/></Suspense> }/>
                    </Route>
                    <Route path="phase/:phaseType">
                        <Route path="edit-annotators" element={ <Suspense><EditAnnotators/></Suspense> }/>
                        <Route path="import-annotations" element={ <Suspense><ImportAnnotations/></Suspense> }/>

                        <Route path="spectrogram/:spectrogramID" element={ <Suspense><AnnotatorPage/></Suspense> }/>
                    </Route>
                </Route>
            </Route>

            <Route path="spectrogram-example" element={ <Suspense><SpectrogramExamplePage/></Suspense> }/>
            <Route path="sound-library" element={ <Suspense><SoundLibraryPage/></Suspense> }/>
            <Route path="documentation" element={ <Suspense><DocumentationPage/></Suspense> }/>

            <Route path="account" element={ <Suspense><Account/></Suspense> }/>

          { currentUser?.isSuperuser &&
              <Route path="admin">
                  <Route path="sql" element={ <Suspense><SqlQuery/></Suspense> }/>
              </Route> }

            <Route path="" element={ <Navigate to="/app/annotation-campaign" replace state={ { from } }/> }/>
        </Route> }

        {/* Redirect unauthenticated users to login */}
        <Route path="*" element={ <Navigate to="/app/login" replace state={ { from } }/> }/>
      </Route>

      {/* Fallback - redirect to OceanSound */}
      <Route path="*" element={ <Navigate to="/oceansound" replace/> }/>
    </Routes>
  )
}

export default App;
