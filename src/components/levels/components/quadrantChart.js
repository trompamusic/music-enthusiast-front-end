import React from 'react';

const changeColor = (val, total) => {
  const value = (val / total) * 1279;
  let newColor = [];
  if (value < 256 ) newColor = [255 - value, 255 - value, 255];
  else if (256 <= value && value < 512 ) newColor = [0, value % 256, 255];
  else if (512 <= value && value < 768 ) newColor = [0, 255, 255 - value % 256];
  else if (768 <= value && value < 1024 ) newColor = [value % 256, 255, 0];
  else if (1024 <= value && value < 1280 ) newColor = [255, 255 - value % 256, 0];
  return {
    background: 'rgb(' + newColor.join(',') + ')',
    // backgroundImage: 'linear-gradient(45deg, rgb(' + newColor.join(',') + '), white)',
    backgroundImage: 'radial-gradient(rgb(' + newColor.join(',') + '), white)',
  };
};

const quadrants = (q, N, current, t) => q.map((row, i) => <tr key={'col_' + i} className="quadrant">
  {row.map((r, j) => <td key={'col_' + j} className="quadrant" style={changeColor(r, N)} >
    {r}
    {current.a === i && current.v === j ? <div className="annotation-circle" title={t('your_choice')} /> : ''}
  </td>)}
</tr>);

export default function QuadrantChart({ data, myQ, t, }) {
  return <div className="stats-chart">
    <h3>{t('Quadrant_heat_map')}</h3>
    <table>
      <tbody>
      <tr className="title">
        <td rowSpan="4" className="title">{t('Unpleasant')}</td>
        <td colSpan="2" className="upper-title">
          {t('High_Energy')}
        </td>
        <td rowSpan="4" className="title">{t('Pleasant')}</td>
      </tr>
      {quadrants(data.q, data.N, myQ, t)}
      <tr className="title">
        <td colSpan="2" className="lower-title">
          {t('Low_Energy')}
        </td>
      </tr>
      </tbody>
    </table>
    <div className="heatmap-legend">
      <img id="legend-img" src={process.env.PUBLIC_URL + '/img/heatmap.png'} alt="legend" />
      <div className="legend-txt-container" style2="float: left;width: 100%;">
        <div className="zero"  style2="float: left;">0%</div>
        <div className="hundred" style2="float: right;">100%</div>
      </div>
    </div>
  </div>;
}