import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonButton, IonSpinner } from '@ionic/react';
import { useToast } from '@/components/ui';
import { FormBloc, Input, Select, Textarea } from '@/components/form';
import { DatasetSelect } from '@/features/Dataset';
import styles from './styles.module.scss'
import { useCreateCampaign } from '@/api';
import { type Colormap, COLORMAPS } from '@/features/Colormap';

export const NewAnnotationCampaign: React.FC = () => {

  const {
    createCampaign,
    campaign,
    isLoading: isSubmittingCampaign,
    error: errors,
    formErrors,
  } = useCreateCampaign()
  const toast = useToast();
  const navigate = useNavigate();

  const page = useRef<HTMLDivElement | null>(null);

  // Global information
  const [ name, setName ] = useState<string>('');
  const [ description, setDescription ] = useState<string>('');
  const [ instructionsUrl, setInstructionsUrl ] = useState<string>('');
  const [ deadline, setDeadline ] = useState<string>('');
  const onNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, [])
  const onDescChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }, [])
  const onInstructionsURLChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInstructionsUrl(e.target.value)
  }, [])
  const onDeadlineChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value)
  }, [])

  // Data
  const [ datasetID, setDatasetID ] = useState<string | undefined>();
  const [ analysisIDs, setAnalysisIDs ] = useState<string[]>([]);
  const [ analysisColormaps, setAnalysisColormaps ] = useState<string[]>([]);

  // Spectrogram tuning
  const [ allowImageTuning, setAllowImageTuning ] = useState<boolean>(false);
  const [ allowColormapTuning, setAllowColormapTuning ] = useState<boolean>(false);
  const [ colormapDefault, setColormapDefault ] = useState<Colormap | null>(null);
  const [ colormapInvertedDefault, setColormapInvertedDefault ] = useState<boolean | null>(null);
  const onAllowImageTuningChange = useCallback(() => {
    setAllowImageTuning(prev => !prev)
  }, [ setAllowImageTuning ])
  const onAllowColormapTuningChange = useCallback(() => {
    setAllowColormapTuning(prev => {
      const newValue = !prev;
      setColormapDefault(newValue ? 'Greys' : null)
      setColormapInvertedDefault(newValue ? false : null)
      return newValue
    })
  }, [ setAllowColormapTuning, setColormapDefault ])
  const onColormapDefaultChange = useCallback((value: string | number | undefined) => {
    setColormapDefault(value as Colormap ?? null)
  }, [ setColormapDefault ])
  const onColormapInvertedDefaultChange = useCallback(() => {
    setColormapInvertedDefault(prev => !prev)
  }, [ setColormapInvertedDefault ])
  const isColormapEditable = useMemo(() => analysisColormaps.includes('Greys'), [ analysisColormaps ]);

  // Submit
  const submit = useCallback(() => {
    if (!name || !datasetID || analysisIDs.length === 0) {
      return;
    }
    createCampaign({
      name,
      description,
      instructionsUrl,
      deadline: deadline || undefined,
      datasetID,
      analysisIDs,
      allowImageTuning,
      allowColormapTuning,
      colormapDefault,
      colormapInvertedDefault,
    })
  }, [ name, description, instructionsUrl, deadline, datasetID, analysisIDs, allowImageTuning, allowColormapTuning, colormapDefault, colormapInvertedDefault ])

  useEffect(() => {
    if (errors) toast.raiseError({ error: errors })
  }, [ errors ]);
  useEffect(() => {
    if (!campaign) return;
    navigate(`/annotation-campaign/${ campaign.id }/`)
  }, [ campaign ]);

  return <div className={ styles.page } ref={ page }>

    <h2>Create Annotation Campaign</h2>

    {/* Global */ }
    <FormBloc>
      <Input label="Name" placeholder="Campaign name"
             error={ formErrors?.find(e => e?.field === 'name')?.messages.join(', ') }
             value={ name } onChange={ onNameChange }
             required/>

      <Textarea label="Description" placeholder="Enter your campaign description"
                error={ formErrors?.find(e => e?.field === 'description')?.messages.join(', ') }
                value={ description } onChange={ onDescChange }/>

      <Input label="Instruction URL" placeholder="URL"
             error={ formErrors?.find(e => e?.field === 'instructionsUrl')?.messages.join(', ') }
             value={ instructionsUrl } onChange={ onInstructionsURLChange }/>

      <Input label="Deadline" type="date" placeholder="Deadline"
             error={ formErrors?.find(e => e?.field === 'deadline')?.messages.join(', ') }
             value={ deadline } onChange={ onDeadlineChange }/>
    </FormBloc>

    {/* Dataset & Spectro config */ }
    <FormBloc label="Data">
      <DatasetSelect selectAnalysis
                     datasetError={ formErrors?.find(e => e?.field === 'datasetID')?.messages.join(', ') }
                     analysisError={ formErrors?.find(e => e?.field === 'analysisIDs')?.messages.join(', ') }
                     onDatasetSelected={ setDatasetID }
                     onAnalysisSelected={ setAnalysisIDs }
                     onAnalysisColormapsChanged={ setAnalysisColormaps }/>
    </FormBloc>

    {/* Spectrogram tuning */ }
    <FormBloc label="Spectrogram Tuning">
      {/* Allow brightness / contrast tuning */ }
      <Input type="checkbox" label="Allow brigthness / contrast modification"
             checked={ allowImageTuning } onChange={ onAllowImageTuningChange }/>

      {/* Allow colormap tuning */ }
      <Input type="checkbox" label="Allow colormap modification" disabled={ !isColormapEditable }
             checked={ allowColormapTuning } onChange={ onAllowColormapTuningChange }
             note={ isColormapEditable ? undefined : 'Available only when at least one spectrogram configuration was generated in grey scale' }/>

      {/* Default colormap */ }
      { allowColormapTuning && <Select
          required={ true }
          error={ formErrors?.find(e => e?.field === 'colormapDefault')?.messages.join(', ') }
          label="Default colormap"
          value={ colormapDefault ?? 'Greys' as Colormap }
          placeholder="Select a default colormap"
          optionsContainer="popover"
          options={ Object.keys(COLORMAPS).map((colormap) => ({
            value: colormap, label: colormap, img: `/app/images/colormaps/${ colormap.toLowerCase() }.png`,
          })) }
          onValueSelected={ onColormapDefaultChange }/> }

      {/* Default colormap inverted? */ }
      { allowColormapTuning && <Input type="checkbox" label="Invert default colormap" disabled={ !isColormapEditable }
                                      checked={ colormapInvertedDefault ?? false }
                                      onChange={ onColormapInvertedDefaultChange }
                                      note={ isColormapEditable ? undefined : 'Available only when at least one spectrogram configuration was generated in grey scale' }/> }
    </FormBloc>

    <div className={ styles.buttons }>
      { isSubmittingCampaign && <IonSpinner/> }
      <IonButton disabled={ isSubmittingCampaign } onClick={ submit }>
        Create campaign
      </IonButton>
    </div>
  </div>
}

export default NewAnnotationCampaign
