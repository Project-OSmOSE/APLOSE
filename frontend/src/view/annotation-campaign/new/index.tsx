import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from './styles.module.scss'
import { FormBloc, Input, Select, Textarea } from "@/components/form";
import { IonButton, IonSpinner } from "@ionic/react";
import { useToast } from "@/service/ui";
import { useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Colormap, COLORMAP_GREYS, COLORMAPS } from "@/service/ui/color.ts";
import { CampaignAPI, PostAnnotationCampaign } from "@/service/api/campaign.ts";
import { DatasetSelect } from "@/features/data/dataset/Select.tsx";
import { ID } from "@/service/type.ts";

type Errors = { [key in keyof PostAnnotationCampaign]?: string }

export const NewAnnotationCampaign: React.FC = () => {

  const [ createCampaign, {
    data: createdCampaign,
    isLoading: isSubmittingCampaign,
    error: errorSubmittingCampaign
  } ] = CampaignAPI.endpoints.postCampaign.useMutation()
  const toast = useToast();
  const navigate = useNavigate();

  const [ errors, setErrors ] = useState<Errors>({});
  const page = useRef<HTMLDivElement | null>(null);

  // Global information
  const [ name, setName ] = useState<string>('');
  const [ desc, setDesc ] = useState<string>('');
  const [ instructions_url, setInstructionsUrl ] = useState<string>('');
  const [ deadline, setDeadline ] = useState<string>('');
  const onNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrors(prev => ({ ...prev, name: undefined }))
  }, [])
  const onDescChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value)
    setErrors(prev => ({ ...prev, desc: undefined }))
  }, [])
  const onInstructionsURLChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInstructionsUrl(e.target.value)
    setErrors(prev => ({ ...prev, instructions_url: undefined }))
  }, [])
  const onDeadlineChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value)
    setErrors(prev => ({ ...prev, deadline: undefined }))
  }, [])

  // Data
  const [ datasetID, setDatasetID ] = useState<ID | undefined>();
  const [ analysisIDs, setAnalysisIDs ] = useState<ID[]>([]);
  const [ analysisColormaps, setAnalysisColormaps ] = useState<string[]>([]);

  // Spectrogram tuning
  const [ allow_image_tuning, setAllowImageTuning ] = useState<boolean>(false);
  const [ allow_colormap_tuning, setAllowColormapTuning ] = useState<boolean>(false);
  const [ colormap_default, setColormapDefault ] = useState<Colormap | null>(null);
  const [ colormap_inverted_default, setColormapInvertedDefault ] = useState<boolean | null>(null);
  const onAllowImageTuningChange = useCallback(() => {
    setAllowImageTuning(prev => !prev)
    setErrors(prev => ({ ...prev, allow_image_tuning: undefined }))
  }, [ setAllowImageTuning, setErrors ])
  const onAllowColormapTuningChange = useCallback(() => {
    setAllowColormapTuning(prev => {
      const newValue = !prev;
      setColormapDefault(newValue ? 'Greys' : null)
      setColormapInvertedDefault(newValue ? false : null)
      return newValue
    })
    setErrors(prev => ({ ...prev, allow_colormap_tuning: undefined }))
  }, [ setAllowColormapTuning, setColormapDefault, setErrors ])
  const onColormapDefaultChange = useCallback((value: string | number | undefined) => {
    setColormapDefault(value as Colormap ?? null)
    setErrors(prev => ({ ...prev, colormap_default: undefined }))
  }, [ setColormapDefault, setErrors ])
  const onColormapInvertedDefaultChange = useCallback(() => {
    setColormapInvertedDefault(prev => !prev)
    setErrors(prev => ({ ...prev, colormap_inverted_default: undefined }))
  }, [ setColormapInvertedDefault, setErrors ])
  const isColormapEditable = useMemo(() => analysisColormaps.includes("Greys"), [ analysisColormaps ]);

  // Submit
  const submit = useCallback(() => {
    if (!name || !datasetID || analysisIDs.length === 0) {
      const errors: Errors = {};
      if (!name) errors.name = 'Name is required';
      if (!datasetID) errors.dataset = 'Dataset is required';
      if (analysisIDs.length === 0) errors.analysis = 'An analysis is required';
      setErrors(errors);
      page.current?.scrollTo({ top: 0, left: 0 });
      console.log('submit go errors', JSON.stringify(errors), JSON.stringify(analysisIDs))
      return;
    }
    console.log('submit')
    createCampaign({
      name, desc, instructions_url, deadline,
      dataset: datasetID,
      analysis: analysisIDs,
      allow_image_tuning,
      allow_colormap_tuning,
      colormap_default,
      colormap_inverted_default
    })
  }, [ name, desc, instructions_url, deadline, datasetID, analysisIDs, allow_image_tuning, allow_colormap_tuning, colormap_default, colormap_inverted_default ])
  useEffect(() => {
    if (errorSubmittingCampaign) {
      toast.presentError(errorSubmittingCampaign)
      const data = (errorSubmittingCampaign as FetchBaseQueryError).data as any;
      if (!data) return;
      setErrors(data)
      page.current?.scrollTo({ top: 0, left: 0 });
    }
  }, [ errorSubmittingCampaign ]);
  useEffect(() => {
    if (!createdCampaign) return;
    navigate(`/annotation-campaign/${ createdCampaign.id }/`)
  }, [ createdCampaign ]);

  return <div className={ styles.page } ref={ page }>

    <h2>Create Annotation Campaign</h2>

    {/* Global */ }
    <FormBloc>
      <Input label="Name" placeholder="Campaign name" error={ errors.name }
             value={ name } onChange={ onNameChange }
             required={ true }/>

      <Textarea label="Description" placeholder="Enter your campaign description" error={ errors.desc }
                value={ desc } onChange={ onDescChange }/>

      <Input label="Instruction URL" placeholder="URL" error={ errors.instructions_url }
             value={ instructions_url } onChange={ onInstructionsURLChange }/>

      <Input label="Deadline" type="date" placeholder="Deadline" error={ errors.deadline }
             value={ deadline } onChange={ onDeadlineChange }/>
    </FormBloc>

    {/* Dataset & Spectro config */ }
    <FormBloc label="Data">
      <DatasetSelect selectAnalysis
                     errors={ errors }
                     clearError={ e => setErrors(prev => ({ ...prev, [e]: undefined })) }
                     onDatasetSelected={ setDatasetID }
                     onAnalysisSelected={ setAnalysisIDs }
                     onAnalysisColormapsChanged={ setAnalysisColormaps }/>
    </FormBloc>

    {/* Spectrogram tuning */ }
    <FormBloc label="Spectrogram Tuning">
      {/* Allow brightness / contrast tuning */ }
      <Input type="checkbox" label="Allow brigthness / contrast modification"
             checked={ allow_image_tuning } onChange={ onAllowImageTuningChange }/>

      {/* Allow colormap tuning */ }
      <Input type="checkbox" label="Allow colormap modification" disabled={ !isColormapEditable }
             checked={ allow_colormap_tuning } onChange={ onAllowColormapTuningChange }
             note={ isColormapEditable ? undefined : "Available only when at least one spectrogram configuration was generated in grey scale" }/>

      {/* Default colormap */ }
      { allow_colormap_tuning && <Select
          required={ true }
          label="Default colormap"
          value={ colormap_default ?? COLORMAP_GREYS }
          placeholder="Select a default colormap"
          optionsContainer="popover"
          options={ Object.keys(COLORMAPS).map((colormap) => ({
            value: colormap, label: colormap, img: `/app/images/colormaps/${ colormap.toLowerCase() }.png`
          })) }
          onValueSelected={ onColormapDefaultChange }/> }

      {/* Default colormap inverted? */ }
      { allow_colormap_tuning && <Input type="checkbox" label="Invert default colormap" disabled={ !isColormapEditable }
                                        checked={ colormap_inverted_default ?? false }
                                        onChange={ onColormapInvertedDefaultChange }
                                        note={ isColormapEditable ? undefined : "Available only when at least one spectrogram configuration was generated in grey scale" }/> }
    </FormBloc>

    <div className={ styles.buttons }>
      { isSubmittingCampaign && <IonSpinner/> }
      <IonButton disabled={ isSubmittingCampaign } onClick={ submit }>
        Create campaign
      </IonButton>
    </div>
  </div>
}