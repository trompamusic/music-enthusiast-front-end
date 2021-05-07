export const isLocalEnv = process.env.REACT_APP_DEVELOPMENT === 'true';
export const customMuziekweb = process.env.REACT_APP_USE_CUSTOM_MUZIEKWEB === 'true';
export const MWSCRIPT_URL = process.env.REACT_APP_MUZIEKWEB_REGISTERED === 'true'? 
  'https://media.cdr.nl/AUDIO/js/mwplayer.js' : process.env.PUBLIC_URL + '/mw_simulator.js';

export const authentication_providers = process.env.REACT_APP_AUTH_PROVIDERS ? process.env.REACT_APP_AUTH_PROVIDERS.split(',') : ['solid','google'];

const prefix = process.env.REACT_APP_POST_METHODS_PREFIX === 'false'?
  '' : process.env.REACT_APP_POST_METHODS_PREFIX || '/trompa/action/lds/trompa/TROMPA_';

export const USER_AUTH = {
  GOOGLE: {
    AUTH: process.env.REACT_APP_GOOGLE_AUTH || '/trompa/action/googlelogin',
    ACCEPTED_TERMS: process.env.REACT_APP_GOOGLE_ACCEPTED_TERMS || '/trompa/action/googleloginredirect',
  },
  SOLID: {
    AUTH: process.env.REACT_APP_SOLID_AUTH || '/trompa/action/solidloginredirect',
    ACCEPTED_TERMS: process.env.REACT_APP_SOLID_ACCEPTED_TERMS || '/trompa/action/solidloginredirect',
  },
  LOGOUT: process.env.REACT_APP_LOGOUT || '/trompa/action/logout',
  POST_PREFIX: prefix,
};

export default {
  authentication_providers,
  isLocalEnv,
  customMuziekweb,
  MWSCRIPT_URL,
  USER_AUTH
};