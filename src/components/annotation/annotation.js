import React from 'react';
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import {analytics, servercall} from '../../utils/services';
import Loading from '../shared/loading';
import Popup from '../shared/popup';
import SongAnnotation from './components/songAnnotation';
import SongStats from './components/songStats';
import AnnotationHelp from './components/annotationHelp';
import UserEmotionTag from "./components/userEmotionTag";

/*
  getSongsPromise: Promise to obtain pending songs in a specific campaign (folderId).
*/
const getSongsPromise = (folderId) => (new Promise((resolve, reject)=> {
  servercall('POST', 'getSongs', { mfid: folderId }, (data, err) => {
    if (err) resolve({songs: []});
    resolve(data);
  });
}));

/*
  HelpTitle: Module that renders header for annotation help popup
  props:
    t: i18n method for translation based on current language.
    firstTime: flag that determines if help is first time showed (true) or requested by user (false).
    close: function to close help popup title
*/
function HelpTitle({t, firstTime, close}) {
  if (firstTime) {
    return <div className="help-title-text">{t('First_time_hint_title')}</div>;
  } else {
    return <div className="help-title-close-btn"><div onClick={close}>X</div></div>;
  }
}

/*
  AnnotationClass: Module that renders the annotation section. Based on user parameters, it can load the "user mood"
  section, the "song annotation" section or can open the help modal.
  props:
    folderId: id of the selected campaign.
    t: i18n method for translation based on current language.
*/
class AnnotationClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupVisible: false,
      annotationLvl: 0,
      songs: [],
      loading: true,
      userEmotionTag: false,
      currentIndex: null,
      tutorial: false,
    };
  }
  async componentDidMount() {
    const { folderId } = this.props;
    const { tutorial, songs, annotationLvl, userEmotionTag, error } = await getSongsPromise(folderId);
    if (error && error === "no_level_permission") {
      this._configureNotAllowedPopup();
      this.setState({ popupVisible: true });
    } else if (songs.length === 0) {
      this._configureEndOfFolderPopup();
      this.setState({ popupVisible: true });
    } else {
      const state = {
        songs,
        loading: false,
        userEmotionTag,
        currentIndex: Math.floor(Math.random() * songs.length),
        annotationLvl: annotationLvl || 0,
      };
      if (tutorial) {
        this._configureHelpPopup(annotationLvl, true);
        state.popupVisible = true;
      } else {
        this.startTime = new Date();
      }
      this.setState(state);
    }
  }
  _emptyPopup = () => {
    this._size = null;
    this._popupTitle = '';
    this._popupContent = '';
    this._popupButtons = '';
  };
  _configureHelpPopup = (annotationLvl, firstTime) => {
    const { t } = this.props;
    this._size = '50%';
    const onClose = () => {
      this.setState({ popupVisible: false });
      this._emptyPopup();
      this.startTime = new Date();
    };
    this._popupTitle = <HelpTitle t={t} firstTime={firstTime} close={onClose} />;
    this._popupContent = <AnnotationHelp key="annotationHelp" annotationLvl={annotationLvl} onClose={onClose} />;
  };
  _configureStatsPopup = (song, response, myAnnotation, isLast) => {
    const { t } = this.props;
    const { annotationLvl } = this.state;
    this._size = '60%';
    this._popupTitle = <div className="stats-title">{t('Annotated_song') + ': ' + (song.performer || '') + ' - ' + song.name}</div>;
    this._popupContent = <SongStats key="songStats" {...{ annotationLvl, song, annotations: response, myAnnotation }} />;
    this._popupButtons = <div
      onClick={() => {
        if(isLast) {
          this._configureEndOfFolderPopup();
          this.setState({ popupVisible: true });
        } else {
          this.setState({ popupVisible: false });
          this._emptyPopup();
          this.startTime = new Date();
        }
      }}
      className="button close-button"
    >
      {t('Close_stats')}
    </div>;
  };
  _configureEndOfFolderPopup = () => {
    const { t } = this.props;
    this._size = '350px';
    this._popupTitle = t('All_songs_completed_message');
    this._popupContent = '';
    this._popupButtons = [
      <Link key="return-button" to="/trompa/rc/annotate">
        <div key="ok-button" className="button ok-button">
          {t('Return_search')}
        </div>
      </Link>,
      <Link key="home-button" to="/trompa/rc">
        <div key="cancel-button" className="button cancel-button">
          {t('Go_home')}
        </div>
      </Link>
    ];
  };
  _configureNotAllowedPopup = () => {
    const { t } = this.props;
    this._size = '350px';
    this._popupTitle = t('Folder_not_allowed_message');
    this._popupContent = '';
    this._popupButtons = [
      <Link key="return-button" to="/trompa/rc/annotate">
        <div key="ok-button" className="button ok-button">
          {t('Return_search')}
        </div>
      </Link>,
      <Link key="home-button" to="/trompa/rc">
        <div key="cancel-button" className="button cancel-button">
          {t('Go_home')}
        </div>
      </Link>
    ];
  };
  _sendAnnotation = (annotation) => {
    const { currentIndex, songs } = this.state;
    const currentSong = songs[currentIndex] || {};
    annotation.level = this.state.annotationLvl;
    annotation.songId = currentSong.localId;
    annotation.folderId = currentSong.folderId;
    annotation.annotationTime = (new Date()).getTime() - this.startTime.getTime();
    this.setState({ loading: true });
    servercall('POST', 'insertAnnotation', annotation, (data, err) => {
      const newSongsArray = [ ...songs.slice(0, currentIndex), ...songs.slice(currentIndex + 1, songs.length) ];
      if (newSongsArray.length === 0) {
        this._configureStatsPopup(currentSong, err? {} : data, annotation, true);
        this.setState({ popupVisible: true });
      } else {
        this._configureStatsPopup(currentSong, err? {} : data, annotation);
        this.setState({
          popupVisible: true,
          loading: false,
          songs: newSongsArray,
          currentIndex: Math.floor(Math.random() * newSongsArray.length),
        });
      }
    });
  };
  _sendUserEmotion = (ue) => {
    servercall('POST', 'updateUserEmotion', ue, (data, err) => {
      this.setState({ userEmotionTag: false });
    });
  };
  _onClickHelp = (aLvl) => {
    this._configureHelpPopup(aLvl);
    analytics({ click: 'help-btn' });
    this.setState({popupVisible: true});
  };
  render() {
    const { loading, songs, userEmotionTag, annotationLvl, currentIndex, popupVisible } = this.state;
    let mainItem = '';
    if (loading) {
      mainItem = <Loading key="loadingComp" />;
    } else if (popupVisible) {
      mainItem = <></>;
    } else if (userEmotionTag) {
      mainItem = <UserEmotionTag sendUserEmotion={this._sendUserEmotion}/>;
    } else if (annotationLvl) {
      mainItem = <SongAnnotation
        key="levelComp"
        help={() => this._onClickHelp(annotationLvl)}
        annotationLvl={annotationLvl}
        song={songs[currentIndex]}
        pendingSongs={songs.length}
        sendAnnotation={this._sendAnnotation}
      />;
    }
    return <div className="homepage-div">
      {mainItem}
      <Popup title={this._popupTitle} content={this._popupContent} buttons={this._popupButtons} visible={popupVisible} size={this._size}/>
    </div>;
  }
}


/*
  Annotation: Module that renders the AnnotationClass module passing the props based on the current url parameters.
*/
export default function Annotation() {
  const { t } = useTranslation();
  const { folderId } = useParams();
  if (folderId !== undefined)
    return (<AnnotationClass folderId={folderId} t={t} />);
  return '';
};
