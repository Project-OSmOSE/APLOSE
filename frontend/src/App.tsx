import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import './css/bootstrap-4.1.3.min.css';
import '@ionic/react/css/core.css';
import './css/ionic-override.css';
import './css/annotation-colors.css';
import './css/app.css';

import { IonApp, setupIonicReact } from '@ionic/react';

import { StoreProvider, useAppSelector } from '@/features/App';
import { useLoadEventService } from '@/features/UX/Events';
import { AlertProvider } from '@/components/ui/Alert';
import { selectIsConnected } from '@/features/Auth';
import { ReactFlowProvider } from '@xyflow/react';
import { AudioProvider } from '@/features/Audio';
import { SuspenseAdminOnly, SuspenseSuperUserOnly } from '@/components/layout';
import BackgroundTask from '@/features/BackgroundTask';

const Home = lazy(() => import('./view/home/Home'));
const Login = lazy(() => import('./view/auth/Login'));
const Account = lazy(() => import('./view/account'));
const SqlQuery = lazy(() => import('./view/admin/sql'));
const OntologyPage = lazy(() => import('./view/admin/ontology'));
const OntologyTab = lazy(() => import('./view/admin/ontology/[type]'));
const OntologyPanel = lazy(() => import('./view/admin/ontology/[type]/[id]'));
const StorageBrowser = lazy(() => import('./view/storage'));
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

const AploseSkeleton = lazy(() => import('./components/layout/Skeleton'));


setupIonicReact({
    mode: 'md',
    spinner: 'crescent',
});

export const App: React.FC = () => (
    <StoreProvider>
        <IonApp>
            <BrowserRouter basename="/app/">
                <AudioProvider>
                    <AlertProvider>
                        <BackgroundTask.Provider>
                            <ReactFlowProvider>
                                <AppContent/>
                            </ReactFlowProvider>
                        </BackgroundTask.Provider>
                    </AlertProvider>
                </AudioProvider>
            </BrowserRouter>
        </IonApp>
    </StoreProvider>
)

const AppContent: React.FC = () => {
    useLoadEventService();

    const isConnected = useAppSelector(selectIsConnected)

    const from = useLocation()

    return (
        <Routes>

            <Route index element={ <Suspense><Home/></Suspense> }/>

            <Route path="login" element={ <Suspense><Login/></Suspense> }/>

            { isConnected && <Route element={ <Suspense><AploseSkeleton/></Suspense> }>

                <Route path="annotation-campaign">
                    <Route index element={ <Suspense><AnnotationCampaignList/></Suspense> }/>
                    <Route path="new" element={ <SuspenseAdminOnly><NewAnnotationCampaign/></SuspenseAdminOnly> }/>
                    <Route path=":campaignID">
                        <Route element={ <Suspense><AnnotationCampaignDetail/></Suspense> }>
                            <Route index element={ <Suspense><AnnotationCampaignInfo/></Suspense> }/>
                            <Route path="phase/:phaseType"
                                   element={ <Suspense><AnnotationCampaignPhaseDetail/></Suspense> }/>
                        </Route>
                        <Route path="phase/:phaseType">
                            <Route path="edit-annotators" element={ <Suspense><EditAnnotators/></Suspense> }/>
                            <Route path="import-annotations" element={ <Suspense><ImportAnnotations/></Suspense> }/>

                            <Route path="spectrogram/:spectrogramID" element={ <Suspense><AnnotatorPage/></Suspense> }/>
                        </Route>
                    </Route>
                </Route>

                <Route path="account" element={ <Suspense><Account/></Suspense> }/>

                <Route path="dataset">
                    <Route index element={ <SuspenseAdminOnly><DatasetList/></SuspenseAdminOnly> }/>
                    <Route path=":datasetID" element={ <SuspenseAdminOnly><DatasetDetail/></SuspenseAdminOnly> }/>
                </Route>

                <Route path="storage">
                    <Route index element={ <SuspenseAdminOnly><StorageBrowser/></SuspenseAdminOnly> }/>
                </Route>

                <Route path="admin">
                    <Route path="sql" element={ <SuspenseSuperUserOnly><SqlQuery/></SuspenseSuperUserOnly> }/>
                    <Route path="ontology" element={ <SuspenseSuperUserOnly><OntologyPage/></SuspenseSuperUserOnly> }>
                        <Route path=":type" element={ <SuspenseSuperUserOnly><OntologyTab/></SuspenseSuperUserOnly> }>
                            <Route path=":id"
                                   element={ <SuspenseSuperUserOnly><OntologyPanel/></SuspenseSuperUserOnly> }/>
                        </Route>
                    </Route>
                </Route>

                <Route path="" element={ <Navigate to="/annotation-campaign" replace/> }/>
            </Route> }

            { isConnected ?
                <Route path="*" element={ <Navigate to="/annotation-campaign" replace/> }/> :
                <Route path="*" element={ <Navigate to="/login" replace state={ { from } }/> }/> }
        </Routes>
    )
}

export default App;
