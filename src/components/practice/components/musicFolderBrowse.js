import React from "react";
import { Link } from "react-router-dom";
import { analytics } from '../../../utils/services';

const colors = (annotations, songs, enabled) => {
  const style = {};
  if (!(songs > 0)) return style;
  if (!enabled) {
    return { color: 'grey' };
  } else {
    const percentage = annotations / songs * 100;
    if (percentage > 0 && percentage < 50) style['color'] = 'red';
    else if (percentage >= 50 && percentage < 100) style['color'] = '#c3c323';
    else if (percentage === 100) style['color'] = 'green';
  }
  return style;
};

export default function MusicFolderBrowse({ t, folders }) {
  return <div className="browse_elements">
    {folders.map(f =>
      <div key={f.folderId} className={'folder-element '.concat(f.enabled? 'clickable' : '')} title={f.enabled? f.description : t('Campaign_blocked', {campaign: f.parent})}>
        <FolderContainer
          key={f.folderId}
          to={'/trompa/rc/annotate/fi='.concat(f.folderId)}
          enabled={f.enabled}
          onclick={() => analytics({ click: 'Folder-' + f.folderId})}
        >
          <div className={!f.enabled? 'folder-disabled' : ''}>
            <div className="folder-element-score">
              <p className="music-folder-title" style={colors(f.annotations, f.songs, f.enabled)}>
                {f.enabled? f.annotations + '/' + f.songs : '-/-'}
              </p>
            </div>
            <div className="folder-element-image">
              <img className="music-directory-img" src={process.env.PUBLIC_URL + '/img/musicFolder' + (f.enabled? '' : '_locked') + '.png'} alt="music folder"/>
            </div>
            <div className="folder-element-text">
              <p className="music-folder-title">{f.name}</p>
            </div>
          </div>
        </FolderContainer>
      </div>)}
  </div>;
}

const FolderContainer = ({to, enabled, children, onclick}) => {
  return enabled? <Link to={to} onClick={onclick}>
    {children}
  </Link> : <div onClick={onclick}>{children}</div>;
};