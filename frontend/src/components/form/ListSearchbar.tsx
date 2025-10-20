import React, { useEffect, useState } from 'react';
import { IonItem, IonList, IonSearchbar } from '@ionic/react';
import { createPortal } from 'react-dom';
import { usePopover } from '@/components/ui';
import styles from './form.module.scss';
import { Item } from './types';
import { Searchbar } from './Searchbar';
import { searchFilter } from '@/service/function';

interface Props {
  values: Array<Item>;
  onValueSelected?: (value: Item) => void;
  placeholder: string;
  className?: string;
}

export const ListSearchbar: React.FC<Props> = (props) => {
  const { containerRef, top, left, width } = usePopover()

  const [ search, setSearch ] = useState<string>();
  const [ searchResult, setSearchResult ] = useState<Array<any>>([]);

  useEffect(() => setSearchResult(searchFilter(props.values, search)), [ search ])

  return (
    <div ref={ containerRef }
         className={ [ styles.searchbar, !search ? '' : styles.withResults ].join(' ') }>
      <Searchbar search={ search }
                 onChange={ setSearch }
                 placeholder={ props.placeholder }
                 className={ props.className }/>
      <IonSearchbar { ...props }
                    value={ search }
                    onIonInput={ e => setSearch(e.detail.value ?? undefined) }></IonSearchbar>

      { !!search && createPortal(<IonList id="searchbar-results"
                                          className={ styles.results }
                                          lines="none"
                                          style={ { top, left, width } }>
        { (searchResult.length > 5 ? searchResult.slice(0, 4) : searchResult.slice(0, 5)).map((v, i) => (
          <IonItem key={ i } onClick={ () => {
            setSearch(undefined);
            if (props.onValueSelected) props.onValueSelected(v)
          } }>{ v.label }</IonItem>
        )) }
        { searchResult.length > 5 && <IonItem className="none">{ searchResult.length - 4 } more results</IonItem> }
        { searchResult.length === 0 && <IonItem className="none">No results</IonItem> }
      </IonList>, document.body) }

    </div>
  )
}
