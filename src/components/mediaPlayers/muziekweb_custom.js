import React, { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next';
import { MWSCRIPT_URL } from '../../utils/constants';

const pauseLogo = 'M13,10 L13,30 L19,30 L19,10 L13,10 Z M21,10 L21,30 L27,30 L27,10 L21,10';
const playLogo = 'M30,20 L13,10 L13,30 L30,20';

function ProgressBar({ songId }) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    window.mwProgress = (titelnummer, tracknumber, progressPerc) => {
      const currentId = [titelnummer,tracknumber].join('-');
      const newTime = currentId === songId? -progressPerc / 100 * 113 : 0;
      setTime(newTime);
    };
    return () => {
      window.mwProgress = null;
    }
  }, [songId]);
  return <circle cx="20" cy="20" r="18" stroke="#f65c2e" fill="none" className="playbutton-path" style={{ strokeDashoffset: time }}/>;
}

function SongInfo({showInfo, song}) {
  const { t } = useTranslation();
  if (!showInfo) return '';
  return song? <div className="mwplayer-button-description">
    <div className="title">{song.name}</div>
    {song.composer? <div className="artist">{song.composer}</div> : ''}
    {song.performer? <div className="artist">{song.performer}</div> : ''}
    <div className="mw-info">
      <a target="_blank" rel="noopener noreferrer" href={'https://www.muziekweb.nl/en/Link/'.concat(song.publicId.split('-')[0], '/?TrackID=', song.publicId)}>
        <img width="90px" src={process.env.PUBLIC_URL + '/img/mw_logo.png'} alt="info"/>
      </a>
    </div>
  </div> : <div className="mwplayer-button-description">
    <div className="artist">{t('Select_song')}</div>
  </div>;
}

export default function Muziekweb({ song, autoPlay = false, showInfo = false }) {
  const [playing, setPlaying] = useState(false);
  const [scriptLoaded, setScript] = useState(false);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = MWSCRIPT_URL;
    script.async = true;
    const onScriptLoaded = () => setScript(true);
    script.addEventListener('load', onScriptLoaded);
    document.body.appendChild(script);
    window.mwPlayerStart = () => { setPlaying(true); };
    window.mwPlayerStop = () => { setPlaying(false); };
    return () => {
      script.removeEventListener('load', onScriptLoaded);
      document.body.removeChild(script);
      try{ document.body.removeChild(document.getElementById('mwplayer_div').parentNode); } catch (e) {}
      window.mwStop();
      window.mwPlayTrack = null;
      window.mwStop = null;
      window.mwPlayerStart = null;
      window.mwPlayerStop = null;
    }
  }, []);
  useEffect(() => {
    if (autoPlay && song && scriptLoaded) {
      window.mwStop();
      window.mwPlayTrack(song.publicId);
    } else if (!song && window.mwStop) window.mwStop();
  }, [song, autoPlay, scriptLoaded]);

  const _playerPressed = () => {
    if (playing) window.mwStop();
    else if (song) window.mwPlayTrack(song.publicId);
  };
  return <div className="player-container">
    <div className="inner-container">
      <div className="mwplayer-button">
        <svg onClick={_playerPressed} viewBox="0 0 40 40">
          <g fill="none" fillRule="evenodd" stroke="none">
            <circle cx="20" cy="20" r="17" stroke="#f65c2e" fill="none" className="playbutton-back" />
            <ProgressBar songId={scriptLoaded && song && song.publicId} />
            <path fill="none" d={ playing? pauseLogo : playLogo } stroke="none" className="main-fill"/>
          </g>
        </svg>
      </div>
      <SongInfo song={scriptLoaded && song} showInfo={showInfo} />
    </div>
  </div>;
}