import React from 'react';

export default function SongsList({ current, onItemClick, list, t }) {
  if (!list || list.length === 0) return <div className="song-list">
    {t('No_songs_in_list')}
  </div>;
  return <div className="song-list">
    <div className="song-row-title">
      <div className="song-name">{t('Name')}</div>
      <div className="song-artist">{t('Artist')}</div>
    </div>
    {list.map( (song) => {
      return <div key={song.localId} className={'song-row'.concat(current && current.localId === song.localId? ' selected' : '')} onClick={() => { onItemClick(song); }}>
        <div className="song-name">{song.name || ' '}</div>
        <div className="song-artist">{song.performer || ' '}<br />{song.composer || ' '}</div>
      </div>;
    })}
  </div>;
}