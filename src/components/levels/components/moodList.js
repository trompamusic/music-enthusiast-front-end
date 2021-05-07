import React from 'react';

export default function MoodList({ data, myAnnotation, t }) {
  return <div className="stats-chart">
    <h3>{t('Most_ranked_moods')}</h3>
    <table>
      <tbody>
      {data.moods.map(mood => (<tr key={mood.lbl} id={mood.lbl}>
        <td className="mood-name">{t(mood.lbl)}:</td>
        <td
            className={'mood-value '.concat(mood.lbl === myAnnotation.moodValue? 'selected' : '')}
            title={mood.lbl === myAnnotation.moodValue? t('your_choice') : null}
        >
          <div className="mood-value-div" style={{ width: (mood.count/data.moods[0].count*100) + '%' }}>{mood.count}</div>
        </td>
      </tr>))}
      </tbody>
    </table>
  </div>;
}