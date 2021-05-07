import React from 'react';

const VISIBLE_PAGS = 10;

/*
  Pager: React Component that renders a pager for lists. It has 10 visible pages by default for all the platform.
*/
export default function Pager({ pages, currentPage, onPageChanged }) {
  let min;
  if (currentPage + VISIBLE_PAGS/2 > pages) {
    min = pages - VISIBLE_PAGS < 0 ? 1 : pages - VISIBLE_PAGS + 1 ;
  } else {
    min = currentPage - VISIBLE_PAGS/2 < 1 ? 1 : currentPage - VISIBLE_PAGS/2;
  }
  const total = pages < VISIBLE_PAGS ? pages : VISIBLE_PAGS;
  const pagesArray = Array.from({length: total}, (_, i) => i + min);
  const backward = currentPage - 1 > 0;
  const forward = currentPage < pages;
  return <div className="pager">
    <ul className="pager-list">
      <li className={backward? '' : 'disabled'} onClick={() => backward? onPageChanged(currentPage - 1) : ''}>{"<<"}</li>
      {pagesArray.map(v => <li className={v === currentPage? 'selected' : ''} key={v} onClick={() => v !== currentPage? onPageChanged(v) : ''}>{v}</li>)}
      <li className={forward? '' : 'disabled'} onClick={() => forward? onPageChanged(currentPage + 1) : ''}>{">>"}</li>
    </ul>
  </div>;
};