import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { Button, Modal, type ModalProps } from '@/components/ui';
import { Input } from '@/components/form';
import { IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons/index.js';
import { useAllTasksFilters } from '@/api';
import styles from './styles.module.scss'

export const DateFilterModal: React.FC<ModalProps & {
  onUpdate: () => void
}> = ({ onUpdate, onClose }) => {
  const { params, updateParams } = useAllTasksFilters()

  const minDate: string = useMemo(() => {
    if (!params.from) return '';
    const date = params.from.split('');
    date.pop();
    return date.join('');
  }, [ params ]);

  const maxDate: string = useMemo(() => {
    if (!params.to) return '';
    const date = params.to.split('');
    date.pop();
    return date.join('');
  }, [ params ]);


  function getDateString(event: ChangeEvent<HTMLInputElement>): string | undefined {
    const value = event.currentTarget.value;
    if (!value) return undefined;
    const date = new Date(value);
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    )).toISOString()
  }

  const setMin = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateParams({ from: getDateString(event) })
    onUpdate()
  }, [updateParams, onUpdate])
  const resetMin = useCallback(() => {
    updateParams({ from: undefined })
    onUpdate()
  }, [updateParams, onUpdate])

  const setMax = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateParams({ to: getDateString(event) })
    onUpdate()
  }, [updateParams, onUpdate])
  const resetMax = useCallback(() => {
    updateParams({ to: undefined })
    onUpdate()
  }, [updateParams, onUpdate])


  return <Modal className={ styles.dateFilterModal }
                                             onClose={ onClose }>
      <Input label="Minimum date" type="datetime-local" placeholder="Min date" step="1"
             value={ minDate } onChange={ setMin }/>
      <Button fill="clear" onClick={ resetMin } disabled={ !minDate }>
        <IonIcon icon={ closeOutline }/>
      </Button>

      <Input label="Maximum date" type="datetime-local" placeholder="Max date" step="1"
             value={ maxDate } onChange={ setMax }/>
      <Button fill="clear" onClick={ resetMax } disabled={ !maxDate }>
        <IonIcon icon={ closeOutline }/>
      </Button>
    </Modal>
}