import React from 'react';
import Popup from "../../shared/popup";
import AudioList from "./audioList";

/*
  calculateQuadrant: calculates the quadrant number, based on the valence and arousal values.
 */
const calculateQuadrant = (coords) => {
  if (coords[0] === 1 && coords[1] === 1) return 1;
  else if (coords[0] === -1 && coords[1] === 1) return 2;
  else if (coords[0] === -1 && coords[1] === -1) return 3;
  else if (coords[0] === 1 && coords[1] === -1) return 4;
};

/*
  quadrants: generates the visual rows and cols for quadrant chart
 */
const quadrants = (selectQuadrant) => {
  const x = [-1, 1];
  const y = [1, -1];
  return y.map(r => (<tr key={'col_' + r} className="quadrant">
    {x.map(c => (<td
        key={'row_' + c}
        className={'quadrant'}
    ><img onClick={() => selectQuadrant(calculateQuadrant([ c, r ]))} className="play-img" src={process.env.PUBLIC_URL + '/img/play_button.svg'} alt="banner"/></td>))}
  </tr>));
};

/*
  AnnotateHelp: module that renders the section "how to do annotations"
*/
export default class AnnotateHelp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { popupVisible: false };
    this.title = "";
    this.content = "";
    this.buttons = "";
  }
  _popupClose = (e) => {
    e.stopPropagation();
    this.content = "";
    this.setState({ popupVisible: false });
  };
  _setQuadrant = (quadrant) => {
    const { t } = this.props;
    this.title = <div className="quadrant-help-title">{t('q' + quadrant + '_title')}</div>;
    this.content = <AudioList quadrant={quadrant} />;
    this.buttons = this._popupButtons = <div
        onClick={this._popupClose}
        className="button close-button"
    >
      {t('Close')}
    </div>;
    this.setState({ popupVisible: true })
  };
  render() {
    const { t } = this.props;
    const { popupVisible } = this.state;
    return <div className="help-container">
      <div className="help-text">{t('Annotation_help_text')}</div>
      <div className="help-text">{t('Click_buttons_text')} [1]:</div>
      <div className="help-chart">
        <div className="stats-chart">
          <table>
            <tbody>
            <tr className="title">
              <td rowSpan="4" className="title">{t('Unpleasant')}</td>
              <td colSpan="2" className="upper-title">
                {t('High_Energy')}
              </td>
              <td rowSpan="4" className="title">{t('Pleasant')}</td>
            </tr>
            {quadrants(this._setQuadrant)}
            <tr className="title">
              <td colSpan="2" className="lower-title">
                {t('Low_Energy')}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="help-text"><b>{t('References')}</b></div>
      <div className="help-text">[1] Eerola, T. & Vuoskoski, J. K. (2011). A comparison of the discrete and dimensional models of emotion in music. Psychology of Music, 39(1), 18-49. (Sounds taken from the Soundtracks <a href="https://osf.io/p6vkg/" target="_blank" rel="noopener noreferrer">data set</a>)</div>
      <div className="help-text">[2] Juslin, P.N. (2019). Musical Emotions Explained. Oxford University Press.</div>
      <Popup title={this.title} buttons={this.buttons} content={this.content} visible={popupVisible} size="60%" />
    </div>;
  }
}