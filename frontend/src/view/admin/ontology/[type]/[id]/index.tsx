import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import { IonSpinner } from '@ionic/react';
import { Input, Label } from '@/components/form';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useSound, useSoundCRUD, useSource, useSourceCRUD } from '@/api';
import { useNavParams } from '@/features/UX';

export const OntologyPanel: React.FC = () => {
  const { type, id } = useNavParams();

  const { source, isFetching: isFetchingSource } = useSource({ id, skip: type !== 'source' });
  const { sound, isFetching: isFetchingSound } = useSound({ id, skip: type !== 'sound' });

  const { update: updateSource } = useSourceCRUD()
  const { update: updateSound } = useSoundCRUD()

  const isFetching = useMemo(() => isFetchingSound || isFetchingSource, [ isFetchingSource, isFetchingSound ])
  const data = useMemo(() => type == 'source' ? source : sound, [ type, source, sound ])

  const [ englishName, setEnglishName ] = useState<string | undefined>(data?.englishName);
  const [ frenchName, setFrenchName ] = useState<string | undefined>(data?.frenchName ?? undefined);
  const [ latinName, setLatinName ] = useState<string | undefined>(data?.__typename === 'SourceNode' ? (data?.latinName ?? undefined) : undefined);
  const [ codeName, setCodeName ] = useState<string | undefined>(data?.codeName ?? undefined);
  const [ taxon, setTaxon ] = useState<string | undefined>(data?.taxon ?? undefined);

  const update = useCallback(() => {
    if (!data || !englishName) return;
    switch (type) {
      case 'source':
        return updateSource({
          id: +data.id,
          englishName,
          latinName,
          frenchName,
          codeName,
          taxon,
        }).unwrap()
      case 'sound':
        return updateSound({
          id: +data.id,
          englishName,
          frenchName,
          codeName,
          taxon,
        }).unwrap()
    }
  }, [ updateSource, updateSound, data, englishName, latinName, frenchName, codeName, taxon ])

  const reset = useCallback(() => {
    setEnglishName(data?.englishName);
    setFrenchName(data?.frenchName ?? undefined);
    if (data?.__typename === 'SourceNode') setLatinName(data?.latinName ?? undefined);
    setCodeName(data?.codeName ?? undefined);
    setTaxon(data?.taxon ?? undefined);
  }, [ data ])
  useEffect(() => {
    reset()
  }, [ data ]);

  if (type !== 'source' && type !== 'sound') return <Navigate to="/annotation-campaign" replace/>
  if (!id) return <div className={ styles.panel }/>
  return <div className={ styles.panel }>
    { isFetching && <IonSpinner/> }

    { !isFetching && data && <div className={ styles.item }>
        <h5>ID: { data.id }</h5>
        <div>
            <Label required label="English name"/>
            <Input value={ englishName }
                   onChange={ e => setEnglishName(e.currentTarget.value) }/>
        </div>
      { type === 'source' && <div>
          <Label required label="Latin name"/>
          <Input value={ latinName }
                 onChange={ e => setLatinName(e.currentTarget.value) }/>
      </div> }
        <div>
            <Label required label="French name"/>
            <Input value={ frenchName }
                   onChange={ e => setFrenchName(e.currentTarget.value) }/>
        </div>
        <div>
            <Label required label="Code name"/>
            <Input value={ codeName }
                   onChange={ e => setCodeName(e.currentTarget.value) }/>
        </div>
        <div>
            <Label required label="Taxon"/>
            <Input value={ taxon }
                   onChange={ e => setTaxon(e.currentTarget.value) }/>
        </div>

        <div className={ styles.buttons }>
            <Button color="medium" fill="clear" onClick={ reset }>Reset changes</Button>
            <Button onClick={ update }>Save</Button>
        </div>
    </div> }
  </div>
}
