import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OceanSoundLayout } from './OceanSoundLayout';
import { LandingPage } from './pages/LandingPage';
import { PassiveAcousticMonitoring } from './pages/PassiveAcousticMonitoring';
import { Publications } from './pages/Publications';
import { SoundLibraryPublic } from './pages/SoundLibraryPublic';

/**
 * OceanSound Landing Site
 *
 * Public-facing landing page for the APLOSE platform.
 * Provides information about passive acoustic monitoring,
 * access to sound library, and login to the main application.
 */
export const OceanSoundApp: React.FC = () => {
  return (
    <OceanSoundLayout>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="pam" element={<PassiveAcousticMonitoring />} />
        <Route path="publications" element={<Publications />} />
        <Route path="sounds" element={<SoundLibraryPublic />} />
        <Route path="sounds/:fileIndex" element={<SoundLibraryPublic />} />
        <Route path="*" element={<Navigate to="/oceansound" replace />} />
      </Routes>
    </OceanSoundLayout>
  );
};

export default OceanSoundApp;
