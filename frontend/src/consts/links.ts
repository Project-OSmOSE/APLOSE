export const OSMOSE_URL = 'https://osmose.ifremer.fr/';

export const GITHUB_URL = 'https://github.com/Project-OSmOSE/osmose-app';

export const CONTACT_MAIL = 'osmose@ensta.fr';
export const CONTACT_URI = `mailto:${ CONTACT_MAIL }`;

export const DOWNLOAD_ANNOTATIONS_URL = (phaseID: string) => `/api/download/phase-annotations/${ phaseID }/`
export const DOWNLOAD_PROGRESS_URL = (phaseID: string) => `/api/download/phase-progression/${ phaseID }/`
