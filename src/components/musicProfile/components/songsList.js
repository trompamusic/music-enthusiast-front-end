import React from 'react';
import MediaPlayers from '../../mediaPlayers';

export default function SongsList({ list, t }) {
  if (!list || list.length === 0) return <div className="song-list">
    {t('No_songs_in_list')}
  </div>;
  return <div className="song-list">
    <div className="song-row-title">
      <div className="song-name">{t('Name')}</div>
      <div className="song-artist">{t('Artist')}</div>
      <div className="song-preview">{t('Preview')}</div>
    </div>
    {list.map( (song) => {
      const Player = song.spotifyId? MediaPlayers.Spotify : MediaPlayers[song.source];
      return <div key={song.localId} className="song-row">
        <div className="song-name">{song.name || ' '}</div>
        <div className="song-artist">{song.performer || ' '}<br />{song.composer || ' '}</div>
        <div className="song-preview"><Player song={song} animated /></div>
      </div>;
    })}
  </div>;
}