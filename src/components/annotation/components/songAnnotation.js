import React from 'react';
import Levels from '../../levels';
import MediaPlayers from '../../mediaPlayers';
import { useTranslation } from 'react-i18next';

/*
  AnnotationModule: Module that renders the annotation level module and player based on song information.
  props:
    sendAnnotation: updates object with annotation info and calls method when user clicks on "send"
    annotationLvl: annotation level. (default: 3)
    song: song object. It contains the song information (id, source)
    t: i18n method for translation based on current language.
    pendingSongs: number of pending songs to be annotated in the current campaign.
    help: action when user clicks on help button "?"
*/
class AnnotationModule extends React.Component {
  constructor(props) {
    super(props);
    this.annotation = {};
  }
  _fieldChanged = (e) => { this.annotation[e.target.name] = e.target.value === 'true' };
  _sendAnnotation = (annotation) => { this.props.sendAnnotation({ ...this.annotation, ...annotation }); };
  render() {
    const { annotationLvl, song, t, pendingSongs, help} = this.props;
    const Level = Levels['Level'.concat(annotationLvl)].Level;
    const Player = MediaPlayers[song.source];
    return <div id="favouritesContainer" className="songDiv">
      <div id="audioContainer" className="container-audio">
        <div className="help-tag" onClick={help}>?</div>
        <div className="campaign-progress">
          {t(pendingSongs > 1 ? 'Pending_songs_in_campaign' : 'Pending_song_in_campaign' ,{ songs: pendingSongs })}
        </div>
        <div className="annotation-title">
          <div className="annotation-description">
            <p className="page-title">{t('Annotate_emotions')}</p>
            <p className="page-subtitle">{t('Annotation_hint1')}</p>
            <p className="page-subtitle">{t('Annotation_hint2')}</p>
          </div>
        </div>
        <div className="sticky-player">
          <Player song={song} autoPlay />
        </div>
        <div className="favourite-container">
            <div className="question-text">
              {t('I_like_this_song')}
            </div>
            <div className="question-opts">
              <div className="radio-option">
                <input type="radio" className="checkbox-input" name="favSong" id="favSong_true" value="true" onChange={this._fieldChanged} />
                <label className="checkbox-input" htmlFor="favSong_true">
                  <div className="checkbox-text">{t('Yes')}</div>
                </label>
              </div>
              <div className="radio-option">
                <input type="radio" className="checkbox-input" name="favSong" id="favSong_false" value="false" onChange={this._fieldChanged} />
                <label className="checkbox-input" htmlFor="favSong_false">
                  <div className="checkbox-text">{t('No')}</div>
                </label>
              </div>
            </div>
          </div>
        <div className="favourite-container">
            <div className="question-text">
              {t('I_know_this_song')}
            </div>
            <div className="question-opts">
              <div className="radio-option">
                <input type="radio" className="checkbox-input" name="knownSong" id="knownSong_true" value="true" onChange={this._fieldChanged} />
                <label className="checkbox-input" htmlFor="knownSong_true">
                  <div className="checkbox-text">{t('Yes')}</div>
                </label>
              </div>
              <div className="radio-option">
                <input type="radio" className="checkbox-input" name="knownSong" id="knownSong_false" value="false" onChange={this._fieldChanged} />
                <label className="checkbox-input" htmlFor="knownSong_false">
                  <div className="checkbox-text">{t('No')}</div>
                </label>
              </div>
            </div>
          </div>
      </div>
      <Level key="levelComp" sendAnnotation={this._sendAnnotation} />
    </div>;
  }
}

export default function Annotation(props) {
  const { t } = useTranslation();
  return <AnnotationModule { ...props } t={t} />;
}