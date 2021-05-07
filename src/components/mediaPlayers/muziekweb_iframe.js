import React from 'react';

export default function Muziekweb({ song, animated }) {
  const publicId = (song && song.publicId) || '';
  if (animated) {
    return <iframe
        title="muziekweb-iframe"
        width="300"
        height="30"
        src={'https://www.muziekweb.nl/Embed/'.concat(publicId, '?theme=anim&color=white')}
        frameBorder="no"
        scrolling="no"
        allowtransparency="true"
    />;
  }
  return <iframe
    title="muziekweb-iframe"
    width="260"
    height="60"
    src={'https://www.muziekweb.nl/Embed/'.concat(publicId, '?theme=static&color=white')}
    frameBorder="no"
    scrolling="no"
    allowtransparency="true"
  />;
}