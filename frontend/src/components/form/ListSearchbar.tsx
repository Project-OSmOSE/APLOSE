import React, { useEffect, useState } from 'react';
import { IonItem, IonList } from '@ionic/react';
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
  disabled?: boolean;
}

export const ListSearchbar: React.FC<Props> = ({ values, placeholder, className, onValueSelected, disabled }) => {
  const { containerRef, top, left, width } = usePopover()

  const [ search, setSearch ] = useState<string>();
  const [ searchResult, setSearchResult ] = useState<Array<any>>([]);

  useEffect(() => setSearchResult(searchFilter(values, search)), [ search ])

  return (
    <div ref={ containerRef }
         className={ [ styles.searchbar, !search ? '' : styles.withResults ].join(' ') }>
      <Searchbar search={ search }
                 onInput={ setSearch }
                 disabled={ disabled }
                 placeholder={ placeholder }
                 className={ className }/>

      { !!search && createPortal(<IonList id="searchbar-results"
                                          className={ styles.searchbarResults }
                                          lines="none"
                                          style={ { top, left, width } }>
        { (searchResult.length > 5 ? searchResult.slice(0, 4) : searchResult.slice(0, 5)).map((v, i) => (
          <IonItem key={ i } onClick={ () => {
            setSearch(undefined);
            if (onValueSelected) onValueSelected(v)
          } }>{ v.label }</IonItem>
        )) }
        { searchResult.length > 5 && <IonItem className="none">{ searchResult.length - 4 } more results</IonItem> }
        { searchResult.length === 0 && <IonItem className="none">No results</IonItem> }
      </IonList>, document.body) }

    </div>
  )
}
