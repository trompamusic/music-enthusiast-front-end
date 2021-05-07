import Spotify from './spotify';
import Muziekweb_custom from './muziekweb_custom';
import Muziekweb_iframe from './muziekweb_iframe';
import { customMuziekweb } from '../../utils/constants';
const Muziekweb = customMuziekweb? Muziekweb_custom : Muziekweb_iframe;
/*custom Muziekweb media player only works with URLs registered with Muziekweb.
You must ask CDR permissions to use their script for custom player. */

/*
  NOTE: current data from CE/local database only includes music from muziekweb (source: "Muziekweb").
  Further implementations could include music from spotify or other sources. For implementing new MediaPlayers,
  include the .js in this index.
 */
export default { Muziekweb, Spotify };
