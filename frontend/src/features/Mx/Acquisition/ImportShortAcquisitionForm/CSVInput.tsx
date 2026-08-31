import React from 'react';
import { Upload } from '@solar-icons/react';
import { InputFile } from '@/components/base';
import { useImportShortAcquisitionContext } from './Root';

export const CSVInput: React.FC = () => {
    const {
        inputFileRef,
        onFileChange,
        isReadingFile,
        onReset,
    } = useImportShortAcquisitionContext()

    return <InputFile ref={ inputFileRef }
                      onFileChange={ onFileChange }
                      onReset={ onReset }
                      accept={ [ 'xlsx' ] }
                      forceLoadingState={ isReadingFile }>
        <Upload weight="Linear" size={ 20 }/> Load deployments
    </InputFile>
}
