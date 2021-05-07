import React from 'react';

const quadrants = (q, filterQuadrant) => {
  const x = [-1, 1];
  const y = [1, -1];
  return y.map(r => (<tr key={'col_' + r} className="quadrant">
    {x.map(c => (<td
      key={'row_' + c}
      className={'quadrant'.concat(q && q[0] === c && q[1] === r? ' selected': '')}
      onClick={() => q && q[0] === c && q[1] === r? filterQuadrant(null) : filterQuadrant([ c, r ])}
    />))}
  </tr>));
};

export default function QuadrantSelector({ quadrant, filterQuadrant, t }) {
  return <div className="quadrant-filter">
    <div className="filter-description">{t('Filter_by_quadrant')}</div>
    <div className="stats-chart">
      <table>
        <tbody>
        <tr className="title">
          <td rowSpan="4" className="title">{t('Unpleasant')}</td>
          <td colSpan="2" className="upper-title">
            {t('High_Energy')}
          </td>
          <td rowSpan="4" className="title">{t('Pleasant')}</td>
        </tr>
        {quadrants(quadrant, filterQuadrant)}
        <tr className="title">
          <td colSpan="2" className="lower-title">
            {t('Low_Energy')}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>;
}