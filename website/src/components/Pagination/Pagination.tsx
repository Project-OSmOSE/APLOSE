import React from 'react';
import { IonButton } from "@ionic/react";

import './Pagination.css';

export interface PaginationProps {
    /** sum of all items */
    totalCount: number,
    currentPage: number,
    /** items per page */
    pageSize: number,
    setPage: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ totalCount, currentPage, pageSize, setPage }) => {
    const pages: Array<number> = [];

    const pageNb = Math.floor(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    for (let i = 1; i <= pageNb; i++) {
        pages.push(i);
    }

    return (
        <div id="pagination-component">
            { pages.map(page => (
                <IonButton key={ page }
                           fill={ currentPage === page ? 'solid' : 'clear' }
                           onClick={ () => setPage(page) }>{ page }</IonButton>
            )) }
        </div>
    );
}
