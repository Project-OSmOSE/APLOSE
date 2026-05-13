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

const OntologyPanel = lazy(() => import('./view/admin/ontology/[type]/[id]'));


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

    const from = useLocation()

    return (
        <Routes>

            {/*{ isConnected && <Route element={ <Suspense><AploseSkeleton/></Suspense> }>*/}

                <Route path="admin">
                    <Route path="ontology">
                        <Route path=":type">
                            <Route path=":id"
                                   element={ <SuspenseSuperUserOnly><OntologyPanel/></SuspenseSuperUserOnly> }/>
                        </Route>
                    </Route>
                </Route>

                <Route path="" element={ <Navigate to="/annotation-campaign" replace/> }/>
            {/*</Route> }*/}

            { isConnected ?
                <Route path="*" element={ <Navigate to="/annotation-campaign" replace/> }/> :
                <Route path="*" element={ <Navigate to="/login" replace state={ { from } }/> }/> }
        </Routes>
    )
}

export default App;
