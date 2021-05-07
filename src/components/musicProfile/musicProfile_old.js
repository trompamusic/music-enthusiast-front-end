import React from 'react';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import { servercall } from '../../utils/services';
import SongsList from './components/songsList';
import Loading from "../shared/loading";
import fullList from '../levels/helpers/emotion-list';
import QuadrantSelector from "./components/quadrantSelector";
import MoodSelector from "./components/moodSelector";
import Collapsible from "../shared/collapsible";

const getSongsPromise = (group, filter) => (new Promise((resolve, reject)=> {
  servercall('POST', 'getSongList', { ...filter, type: group}, (data, err) => {
    if (err) resolve({});
    resolve(data);
  });
}));

const songList = [
  {
    lbl: 'Discovered_music',
    value: 'recommended',
  },
  {
    lbl: 'Music_I_like',
    value: 'liked',
  },
  {
    lbl: 'Music_I_annotated',
    value: 'annotated',
  },
];

class MusicProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: null,
      popupVisible: false,
      loading: true,
      musicList: [],
      emotionList: fullList,
      quadrant: null,
      mood: null
    };
  }
  componentDidMount() { this._changeTab({ ...songList[0], label: this.props.t(songList[0].label) }); }
  _changeTab = async (list) => {
    const { quadrant, mood } = this.state;
    this.setState({ loading: true });
    const filter = {};
    if (quadrant) filter.quadrant = quadrant;
    if (mood) filter.mood = mood;
    const { musicList } = await getSongsPromise(list.value, filter);
    this.setState({ loading: false, currentTab: list, musicList });
  };
  _filterQuadrant = async (quadrant) => {
    const { loading, currentTab } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      const emotionList = quadrant? fullList.filter(m => m.valence === quadrant[0] && m.arousal === quadrant[1]) : fullList;
      const filter = {};
      if (quadrant) filter.quadrant = quadrant;
      const { musicList } = await getSongsPromise(currentTab.value, filter);
      this.setState({ loading: false, musicList, emotionList, quadrant, mood: null });
    }
  };
  _filterMood = async (mood) => {
    const { loading, currentTab } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      const filter = {};
      if (mood && mood.value) filter.mood = mood.value;
      const { musicList } = await getSongsPromise(currentTab.value, filter);
      this.setState({ loading: false, musicList, mood: mood.value });
    }
  };
  render() {
    const { t } = this.props;
    const { musicList, currentTab, loading, quadrant, mood, emotionList } = this.state;
    const listOptions = songList.map(l => ({ ...l, label: t(l.lbl) }));
    return <div className="homepage-div">
      <div className="songDiv">
        <p className="page-title">{t('Explore_music')}</p>
        <p className="page-subtitle">{t('Music_profile_lists')}</p>
        <div className="property-container">
          <div className="property-title">{t('Select_list')}</div>
          <div className="property-value">
            <Select
                options={listOptions}
                value={currentTab && { ...currentTab, label: t(currentTab.lbl) }}
                onChange={this._changeTab}
            />
          </div>
        </div>
        <Collapsible>
          <Collapsible.Header key="header">
            <div className="section-title">
              {t('Mood_filters')}
            </div>
          </Collapsible.Header>
          <Collapsible.Body key="body">
            <div className="songs-filter">
              <div className="mood-filter">
                <div className="filter-description">{t('Filter_by_mood')}</div>
                <MoodSelector list={emotionList} selection={mood} filterMood={this._filterMood} t={t} />
              </div>
              <QuadrantSelector quadrant={quadrant} filterQuadrant={this._filterQuadrant} t={t} />
            </div>
          </Collapsible.Body>
        </Collapsible>
      </div>
      <div className="songDiv">
        <div className="section-title">
          {currentTab && t(currentTab.lbl)}
        </div>
        <div className="recommendation-container">
          {loading? <Loading /> : <SongsList list={musicList} t={t} quadrant={quadrant} mood={mood} />}
        </div>
      </div>
    </div>;
  }
}

export default withTranslation()(MusicProfile);