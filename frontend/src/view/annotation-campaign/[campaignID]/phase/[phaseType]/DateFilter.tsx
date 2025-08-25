import React, { ChangeEvent, Fragment, useMemo, useState } from "react";
import { Modal } from "@/components/ui";
import { Input } from "@/components/form";
import { IonIcon } from "@ionic/react";
import { funnel, funnelOutline } from "ionicons/icons";
import { createPortal } from "react-dom";
import { useSpectrogramFilters } from "@/view/annotation-campaign/[campaignID]/phase/[phaseType]/filter.ts";

export const DateFilter: React.FC<{
  onUpdate: () => void
}> = ({ onUpdate }) => {
  const { params, updateParams } = useSpectrogramFilters()

  const hasDateFilter = useMemo(() => !!params.toDatetime || !!params.fromDatetime, [ params ]);
  const [ filterModalOpen, setFilterModalOpen ] = useState<boolean>(false);

  const minDate: string = useMemo(() => {
    if (!params.toDatetime) return '';
    const date = params.toDatetime.split('');
    date.pop();
    return date.join('');
  }, [ params ]);

  const maxDate: string = useMemo(() => {
    if (!params.fromDatetime) return '';
    const date = params.fromDatetime.split('');
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

  function setMin(event: ChangeEvent<HTMLInputElement>) {
    updateParams({ toDatetime: getDateString(event) })
    onUpdate()
  }

  function setMax(event: ChangeEvent<HTMLInputElement>) {
    updateParams({ fromDatetime: getDateString(event) })
    onUpdate()
  }


  return <Fragment>
    { hasDateFilter ?
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='primary' icon={ funnel }/> :
      <IonIcon onClick={ () => setFilterModalOpen(true) } color='dark' icon={ funnelOutline }/> }

    { filterModalOpen && createPortal(<Modal onClose={ () => setFilterModalOpen(false) }>
      <Input label="Minimum date" type="datetime-local" placeholder="Min date" step="1"
             value={ minDate } onChange={ setMin }/>

      <Input label="Maximum date" type="datetime-local" placeholder="Max date" step="1"
             value={ maxDate } onChange={ setMax }/>
    </Modal>, document.body) }
  </Fragment>
}