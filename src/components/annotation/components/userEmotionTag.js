import React, { useState }  from 'react';
import { useTranslation } from 'react-i18next';

const moods = [
  'sad',
  'bored',
  'calm',
  'relaxed',
  'cheerful',
  'excited',
  'tense',
  'irritated',
  'neutral'
];

/*
  UserEmotionTag: Module that renders user emotion tag section with "robot Mood" scale.
  props:
    sendUserEmotion: method to be executed once the user has filled the whole information. (freemood and mood scale)
*/
export default function UserEmotionTag({sendUserEmotion}) {
  const { t } = useTranslation();
  const [mood, setMood] = useState(null);
  const [freeMood, setFreeMood] = useState(null);

  return <div id="favouritesContainer" className="songDiv">
    <p className="page-title centered">
      {t('usermood_title')}
    </p>
    <div className="moodfield-container">
      <p className="mood-subtitle">{t('write_freemood')}</p>
      <input className="freemood-input" type="text" defaultValue={freeMood} onChange={(e) => setFreeMood(e.target.value)} />
    </div>
    <div className="moodfield-container">
      <p className="mood-subtitle">{t('select_mood_image')}</p>
      <div id="image-selector-container">
        <div className="moodimage-margin" />
        <div className="moodimage-container">
          <img alt="mood" id="mood-image" src={process.env.PUBLIC_URL + '/img/robot-all.png'} />
          {moods.map(m => <div key={m} className={'image-map' + (mood === m? ' selected' : '')} id={'selector-' + m} onClick={() => setMood(m)}/>)}
        </div>
        <div className="moodimage-margin" />
      </div>
    </div>
    <div className="level-button-container">
      <div id="sendButton" className="nav-button" onClick={() => { if (mood && freeMood) sendUserEmotion({ mood, freeMood }); }}>{t('Send')}</div>
    </div>
    <div className="acknowledgement-citation">
      <a target="_blank" rel="noopener noreferrer" href="https://diopd.org/pick-a-mood/">Pick-A-Mood</a> is available under the ‘Creative Commons community license,’ free-of-charge for non-commercial use.
      <p><b>Reference:</b> Vastenburg, M.H., Romero, N., van Bel, D., & Desmet, P.M.A. (2011). PMRI: development of a pictorial mood reporting instrument. In <em>proceedings of CHI 2011</em>, May 7-12, 2011, Vancouver, BC, Canada.</p>
    </div>
  </div>
}