import React from 'react';

export default function Spotify({ song, animated }) {
  return <iframe
    title="spotify-iframe"
    src={"https://open.spotify.com/embed/track/" + song.spotifyId}
    width="100%"
    height="80"
    frameBorder="0"
    allowTransparency="true"
    allow="encrypted-media"
  />;
}