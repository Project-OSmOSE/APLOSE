import React, { ChangeEvent, Fragment, useCallback, useMemo } from 'react';
import { useImportAnnotationsContext } from '@/features/ImportAnnotations/context';
import { useAllDetectors } from '@/api/detector';
import styles from './styles.module.scss';
import { Select, Textarea } from '@/components/form';

export const DetectorConfigurationEntry: React.FC<{
  initialName: string;
}> = ({ initialName }) => {
  const {
    unknownToKnownDetectors,
    unknownToConfiguration,
    assignUnknownToConfiguration,
    ...state
  } = useImportAnnotationsContext()
  const { allDetectors } = useAllDetectors({
    skip: state.fileState !== 'loaded',
  })
  const knownDetector = useMemo(() => {
    return allDetectors?.find(d => d.id == unknownToKnownDetectors[initialName]?.id)
  }, [ allDetectors, unknownToKnownDetectors, initialName ])
  const knownConfigurations = useMemo(() => {
    const detector = knownDetector ?? allDetectors?.find(d => d.name === initialName)
    return detector?.configurations?.filter(c => !!c).map(c => c!) ?? []
  }, [ knownDetector ])
  const className = useMemo(() => [
    styles.configEntry,
    knownConfigurations.length > 0 ? '' : styles.unknown,
  ].join(' '), [ knownConfigurations ])
  const configuration = useMemo(() => unknownToConfiguration[initialName], [ unknownToConfiguration, initialName ]);

  const onSelectConfiguration = useCallback((id: string | number | undefined) => {
    const configuration = knownConfigurations?.find(c => c.id === (typeof id === 'string' ? id : id?.toString()))
    if (!configuration) {
      assignUnknownToConfiguration(initialName, { configuration: '' })
    } else {
      assignUnknownToConfiguration(initialName, configuration)
    }
  }, [ assignUnknownToConfiguration, initialName, knownConfigurations ])

  const onConfigurationTextUpdated = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    assignUnknownToConfiguration(initialName, { configuration: e.currentTarget.value })
  }, [ initialName, assignUnknownToConfiguration ])

  return <div className={ className }>
    <p><strong>{ knownDetector?.name ?? initialName }</strong> { knownDetector &&
        <Fragment>({ initialName })</Fragment> } configuration</p>

    <Select value={ configuration?.id }
            onValueSelected={ onSelectConfiguration }
            options={ knownConfigurations.map(c => ({
              value: c.id,
              label: c.configuration,
            })) ?? [] }
            optionsContainer="popover"
            noneLabel="Create new" noneFirst
            data-testid={ `select-${ initialName }-configuration` }
            placeholder="Select configuration"/>

    <Textarea placeholder="Enter new configuration"
              hidden={ configuration === undefined }
              disabled={ !!configuration?.id }
              data-testid={ `input-${ initialName }-configuration` }
              value={ configuration?.configuration }
              onChange={ onConfigurationTextUpdated }/>

    <div className="line"/>
  </div>
}
