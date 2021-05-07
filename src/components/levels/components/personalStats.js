import React from 'react';
import MediaPlayers from '../../mediaPlayers';

const getQuadrantInfo = (t, q) => {
  let descr = '';
  switch (q) {
    case 1:
      descr = t('High_Energy') + '/' + t('Pleasant') ;
      break;
    case 2:
      descr = t('High_Energy') + '/' + t('Unpleasant') ;
      break;
    case 3:
      descr = t('Low_Energy') + '/' + t('Unpleasant') ;
      break;
    case 4:
      descr = t('Low_Energy') + '/' + t('Pleasant') ;
      break;
    default:
      break;
  }
  return descr;
};

function SongInfo({t, song}) {
  const quadrant_desc = getQuadrantInfo(t, song.quadrant);
  const mode = t('Mode_' + song.mode);
  if (song.bpm && song.mode && song.danceability && song.quadrant) {
    return <div className="congrats-message">
      <div className="recommendation-msg">
        {t('recommendation_properties', {...song, mode, quadrant_desc})}
      </div>
    </div>;
  }
  return <></>;
}

export default function PersonalStats({ t, annotations }) {
  let content = '';
  let message = <div key="next-recommendation-msg" className="recommendation-msg">
    {t('Annotations_for_next_recommendation', { annotations: 5 - annotations.annotatedSongs % 5 })}
  </div>;
  if (annotations.recommendation) {
    message = [<div key="congrats-recommendation-msg" className="recommendation-msg">
      <b>{t('Congratulations')}</b>{t('New_recommendation')}
    </div>, message];
    const Player = MediaPlayers[annotations.recommendation.source];
    content = <>
      <Player song={annotations.recommendation} showInfo />
      <SongInfo song={annotations.recommendation} t={t} />
    </>;
  }
  return <div className="stats-container">
    <div className="stats-score">
      <div>{t('Earned_points')}:</div>
      <div className="user-score-value">{annotations.score || 0}</div>
    </div>
    <div key="message" className="congrats-message">
      {message}
    </div>
    {content}
  </div>;
}