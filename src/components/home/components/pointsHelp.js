import React from 'react';

/*
  PointsHelp: module that renders the bullets with the "how can I earn points?" section
*/
export default function PointsHelp({ t }) {
  const hints = [0,1,2,3,4,5];
  return <div className="points-help-container">
    <ul>
      {hints.map(h => <li key={h}>{t('points.hint'.concat(h))}</li>)}
    </ul>
  </div>;
}