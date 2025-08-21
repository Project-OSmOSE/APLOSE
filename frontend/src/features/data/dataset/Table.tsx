import React, { Fragment, useMemo } from "react";
import { IonNote, IonSkeletonText } from "@ionic/react";
import { dateToString, getErrorMessage } from "@/service/function.ts";
import { Table, TableContent, TableDivider, TableHead, WarningText } from "@/components/ui";
import { DatasetAPI } from "@/features/data/dataset/api";
import { DatasetName } from "@/features/data/dataset/Description.tsx";

export const DatasetTable: React.FC = () => {

  const { data: datasets, error, isFetching } = DatasetAPI.endpoints.getDatasets.useQuery();

  const heads = useMemo(() => {
    return <Fragment>
      <TableHead topSticky isFirstColumn={ true }>
        Name
      </TableHead>
      <TableHead topSticky>Created at</TableHead>
      <TableHead topSticky>Number of analysis</TableHead>
      <TableHead topSticky>Number of files</TableHead>
      <TableHead topSticky>Start date</TableHead>
      <TableHead topSticky>End date</TableHead>
      <TableDivider/>
    </Fragment>
  }, [ isFetching ])

  if (error) <WarningText>{ getErrorMessage(error) }</WarningText>

  if (isFetching) {
    const skeletons = Array.from(new Array(7));
    return <Table columns={ 9 }>
      { heads }

      { skeletons.map((_, i) => <Fragment key={ i }>
        <TableContent isFirstColumn={ true }>
          <IonSkeletonText animated style={ { width: 256, justifySelf: 'center' } }/>
        </TableContent>
        <TableContent><IonSkeletonText animated style={ { width: 128 } }/></TableContent>
        <TableContent><IonSkeletonText animated style={ { width: 32, justifySelf: 'center' } }/></TableContent>
        <TableContent><IonSkeletonText animated style={ { width: 32, justifySelf: 'center' } }/></TableContent>
        <TableContent><IonSkeletonText animated style={ { width: 96 } }/></TableContent>
        <TableContent><IonSkeletonText animated style={ { width: 96 } }/></TableContent>
        <TableDivider/>
      </Fragment>) }
    </Table>
  }


  if (!datasets || datasets.length === 0) return <IonNote color='medium' style={ { textAlign: 'center' } }>No
    datasets</IonNote>

  return <Table columns={ 9 }>
    { heads }

    { datasets.map(d => <Fragment key={ d.name }>
      <TableContent isFirstColumn={ true }><DatasetName { ...d } link/></TableContent>
      <TableContent>{ dateToString(d.createdAt) }</TableContent>
      <TableContent>{ d.analysisCount }</TableContent>
      <TableContent>{ d.filesCount }</TableContent>
      <TableContent>{ dateToString(d.start) }</TableContent>
      <TableContent>{ dateToString(d.end) }</TableContent>
      <TableDivider/>
    </Fragment>) }
  </Table>
}