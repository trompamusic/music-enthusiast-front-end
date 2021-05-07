import emotionList from '../../components/levels/helpers/emotion-list';
import newsList from './testing_news';

const SERVER_DELAY_SIMULATION_TIME = 100;

export const userAuthentication = (callback) => {
  const user = {
    "username": "testuser",
    "userId":826,
    "name":"TEST USER",
    "email":"test.user@email.com",
    "motherLanguage":"en",
    "birthPlace":"Spain",
    "otherLanguages":["en","ko", "de"],
    "language":"en",
    "score": 15,
    "researchData": true,
    "sendMail": true,
    "allowContact": -1,
    "annotatedSongs": 0,
  };
  localStorage.setItem("userRC", JSON.stringify(user));
  window.location = '/trompa';
  return;
};

export const authenticatedUserLogin = () => {

};

export const logOut = () => {
  localStorage.removeItem("userRC");
  window.location.href = '/trompa/rc';
};

const songs = [
  {"localId":849,"publicId":"DFX0216-0012","spotifyId":"0C0OMjOmMT0qNbjImAOboO","name":"Länsiö : 17 Laulua kesästä : 4. Jokin runonpätkä t","composer":"Tapani Länsio","performer":"YL Male Voice Choir","year":"1994-12-02","genre":"","folderId":829,"source":"Muziekweb"},
  {"localId":851,"publicId":"DFX0239-0017","spotifyId":"5Q6cBWQMCwT4F7Bzc9JYUD","name":"17 Estonian Wedding Songs : Don't Hit The Newlywed","composer":"Apex","performer":"Estonian Radio Choir","year":"1995","genre":"","folderId":829,"source":"Muziekweb"},
  {"localId":853,"publicId":"DFX0793-0010","spotifyId":"3ZjI5q4WOJyVD7r4gfhEhv","name":"13 Moravian Songs, Op. 32: IV. Parting without Sor","composer":"Antonín Dvořák","performer":"Samuel Coquard","year":"2009-09-08","genre":"","folderId":829,"source":"Muziekweb"},
  {"localId":852,"publicId":"DFX0334-0008","spotifyId":"6wfF0hgq9076LNZ5pqD1SQ","name":"12 Lieder und Romanzen, Op. 44: No. 1. Minnelied","composer":"Johannes Brahms","performer":"MDR Leipzig Radio Chorus","year":"2016-07-01","genre":"","folderId":829,"source":"Muziekweb"},
];

export const servercall = (method, url, data, callback) => {
  let result = {};
  const user = JSON.parse(localStorage.getItem("userRC"));
  switch (url) {
    case 'getmusicFolders':
      result = {
        "musicFolder":[
          {"folderId":827,"name":"demo 1","enabled":false, "parent":"zdemo", "description": "bla bla", "annotations": 50, "songs": 50},
          {"folderId":828,"name":"demo 3","enabled":false, "parent":"demo 1", "description": "bla bla", "annotations": 10, "songs": 50},
          {"folderId":846,"name":"zdemo 1","enabled":true, "tutorial": true, "description": "bla bla", "annotations": 0, "songs": 4},
          {"folderId":900,"name":"demo 3","enabled":false, "parent":"demo 1", "description": "bla bla", "annotations": 10, "songs": 48}
        ],
        pages: 2,
      };
      break;
    case 'getMymusicFolders':
      result = {
        "musicFolder":[
          {"folderId":827,"name":"demo 1","level":0, "description": "bla bla", "annotations": 0},
          {"folderId":828,"name":"demo 3","level":3, "description": "bla bla", "annotations": 10}
        ],
      };
      break;
    case 'updateuser':
      Object.keys(data).forEach(k => {
        if (k === 'lang') user.language = data.lang;
        else user[k] = data[k];
      });

      localStorage.setItem("userRC", JSON.stringify(user));
      break;
    case 'getuser':
      result = { user: user };
      break;
    case 'getSongs':
      result = {"userEmotionTag": false, "annotationLvl": 3, "songs": songs, "tutorial": true, "total": 4 };
      if (data.mfid === '900') result['error'] = 'no_level_permission';
      break;
    case 'insertAnnotation':
      const { q, mood } = calculateStats();
      const recommendation = {
        "localId":829,
        "publicId":"ECX1135-0027",
        "name":"Noches en los jardines de Espa\u00f1a",
        "composer":"Manuel de Falla",
        "performer":"",
        "section":"I. En el Generalife",
        "year":"0",
        "genre":"Classic",
        "folderId":827,
        "source":"Muziekweb",
        "bpm":158,
        "danceability":30,
        "mode":"Major",
        "key":"D",
        "quadrant": 1,
      };
      result = {recommendation: recommendation, "annotatedSongs": 10, score: 5, q, mood};
      break;
    case 'getRecommendations':
      result = {recommendations: []};
      break;
    case 'getCommunityStats':
      result = {"user": user,"annotations":[{"userAnnotationID":866,"songID":834,"userID":850,"folderId":0,"annotationLevel":3,"valenceValue":1,"Valence_Comment":"","arousalValue":-1,"Arousal_Comment":"","moodValue":"peace","Mood_Comment":"","favSong":false,"knownSong":false,"educationalSong":false,"easySong":true}],"ranking":[{"score":12,"username":"xxxxxxxxx"},{"score":3,"username":"xxxxxxxxxx"}]};
      break;
    case 'getSongList':
      result = {"musicList": songs};
      break;
    case 'getNews':
      result = newsList;
      break;
    case 'getRanking':
      result = { ranking: [{"score":387,"username":"xxxxxxxxxx"},{"score":374,"username":"xxxxxxxxxx"},{"score":360,"username":"xxxxxxxxxx"},{"score":356,"username":"xxxxxxxxxx"},{"score":354,"username":"xxxxxxxxxx"},{"score":352,"username":"xxxxxxxxxx"},{"score":347,"username":"xxxxxxxxxx"},{"score":342,"username":"xxxxxxxxxx"},{"score":330,"username":"xxxxxxxxxx"},{"score":319,"username":"xxxxxxxxxx"}]};
      break;
    default:
  }
  console.log('url:', url);
  console.log('parms:', data);
  if (callback) {
    setTimeout(() => {
      console.log('test result:', result);
      callback(result);
    }, SERVER_DELAY_SIMULATION_TIME);
  }
};

export const analytics = (action) => {
  console.log('analytics:', action);
};

const randomAnnotations = () => {
  const annotations = [];
  for (let i=0; i<1000; i++) {
    const av = Math.floor(Math.random()*10) - 1 < 0? -1 : 1;// Math.round(Math.random())*2 - 1
    const vv = Math.floor(Math.random()*5) - 1 < 0? 1 : -1;// Math.round(Math.random())*2 - 1
    const emotions = emotionList.filter(m => m.arousal === av && m.valence === vv);
    annotations.push({
      arousalValue: av,
      valenceValue: vv,
      moodValue: emotions[Math.floor(Math.random()*emotions.length)].label,
    });
  }
  return annotations;
};

const calculateStats = () => {
  const annotations = randomAnnotations();
  let q = [
    {
      "valenceValue": 1,
      "arousalValue": 1,
      "v_count": annotations.filter(a => a.arousalValue === 1 && a.valenceValue === 1).length,
    },
    {
      "valenceValue": -1,
      "arousalValue": -1,
      "v_count": annotations.filter(a => a.arousalValue === -1 && a.valenceValue === -1).length,
    },
    {
      "valenceValue": -1,
      "arousalValue": 1,
      "v_count": annotations.filter(a => a.arousalValue === 1 && a.valenceValue === -1).length,
    },
    {
      "valenceValue": 1,
      "arousalValue": -1,
      "v_count": annotations.filter(a => a.arousalValue === -1 && a.valenceValue === 1).length,
    },
  ];
  const mood = [];
  emotionList.forEach( e => {
    const v_count = annotations.filter(a => a.moodValue === e.label).length;
    if (v_count > 0) {
      mood.push({
        moodValue: e.label,
        v_count
      });
    }
  });
  return { q, mood };
};

export default {
  userAuthentication,
  authenticatedUserLogin,
  logOut,
  servercall,
  analytics
};