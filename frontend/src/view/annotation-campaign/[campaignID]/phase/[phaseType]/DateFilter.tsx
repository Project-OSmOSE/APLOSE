import React, { ChangeEvent, Fragment, useCallback, useMemo, useState } from "react";
import styles from "./styles.module.scss"
import { Button, Modal } from "@/components/ui";
import { Input } from "@/components/form";
import { IonIcon } from "@ionic/react";
import { closeOutline, funnel, funnelOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { useSpectrogramFilters } from "@/service/slices/filter.ts";

export const DateFilter: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { params, updateParams } = useSpectrogramFilters()

  const hasDateFilter = useMemo(() => !!params.end__gte || !!params.start__lte, [ params ]);
  const [ filterModalOpen, setFilterModalOpen ] = useState<boolean>(false);

  const minDate: string = useMemo(() => {
    if (!params.end__gte) return '';
    const date = params.end__gte.split('');
    date.pop();
    return date.join('');
  }, [ params ]);

  const maxDate: string = useMemo(() => {
    if (!params.start__lte) return '';
    const date = params.start__lte.split('');
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
    updateParams({ end__gte: getDateString(event) })
    onUpdate()
  }, [])
  const resetMin = useCallback(() => {
    updateParams({ end__gte: undefined })
    onUpdate()
  }, [])

  const setMax = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateParams({ start__lte: getDateString(event) })
    onUpdate()
  }, [])
  const resetMax = useCallback(() => {
    updateParams({ start__lte: undefined })
    onUpdate()
  }, [])


  return <Fragment>
    { hasDateFilter ?
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='primary' icon={ funnel }/> :
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='dark' icon={ funnelOutline }/> }

    { filterModalOpen && createPortal(<Modal className={ styles.dateFilterModal }
                                             onClose={ () => setFilterModalOpen(false) }>
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
    </Modal>, document.body) }
  </Fragment>
}