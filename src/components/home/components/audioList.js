import React from 'react';
import { useTranslation } from 'react-i18next';

const audios = [1,2,3,4];

const processDescription = (d) => {
  const newV = d.split('<1>');
  if (newV.length > 1) {
    const ob = JSON.parse(newV[1]);
    return <div className="quadrant-help-description">
      {newV[0]}<a href={ob.url} target="_blank" rel="noopener noreferrer">{ob.title}</a>{newV[2]} [2].
    </div>;
  }
  return d + ' [2].';
};

/*
  AudioList: module that renders the audio list examples"
*/
export default function AudioList({ quadrant }) {
  const { t } = useTranslation();
  return <div className="quadrant-help-content">
    {processDescription(t('q' + quadrant + '_description'))}
    <div className="quadrant-help-audiolist">
      {audios.map(a => <div key={'audio_'.concat(a)} className="quadrant-help-player">
        <audio controls controlslist="nodownload">
          <source src ={process.env.PUBLIC_URL + '/audio/Q' + quadrant + '_' + a + '.mp3'} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>)}
    </div>
  </div>;
}