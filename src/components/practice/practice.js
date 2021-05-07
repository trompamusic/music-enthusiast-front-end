import React from 'react';
import { withTranslation } from 'react-i18next';
import { servercall } from '../../utils/services';
import MusicFolderBrowse from './components/musicFolderBrowse.js';
import Loading from "../shared/loading";
import Pager from "../shared/pager";

class Practice extends React.Component {
  constructor(props) {
    super(props);
    this.searchTxt = React.createRef();
    this.completedTick = React.createRef();
    this.blockedTick = React.createRef();
    this.state = {
      loading: false,
      folders: [],
      pages: 0,
      currentPage: 1,
    };
  }
  _searchFolders = (page = 1) => {
    const srchTxt = this.searchTxt.current.value;
    const completed = this.completedTick.current.checked;
    const blocked = this.blockedTick.current.checked;
    if (srchTxt.trim() === '' || (srchTxt.trim() && srchTxt.trim().length > 3)) {
      this.setState({ loading: true, currentPage: page });
      const params = {
        contains: srchTxt.trim() === '' ? '_null_' : this.searchTxt.current.value,
        page: page,
        completed,
        blocked
      };
      servercall('POST', 'getmusicFolders', params, (data, err) => {
        const folders = err? [] : data.musicFolder;
        const pages = err? 0 : data.pages;
        folders.sort((a, b) => {
          if (a.enabled && !b.enabled) return -1;
          if (!a.enabled && b.enabled) return 1;
          if (a.tutorial && !b.tutorial) return -1;
          if (!a.tutorial && b.tutorial) return 1;
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.setState({ folders, pages, loading: false });
      });
    }
  };
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this._searchFolders();
    }
  };
  _onPageChanged = (p) => {
    this._searchFolders(p);
  };
  _onOptionsChanged = () => {
    this._searchFolders();
  };
  componentDidMount() {
    this._searchFolders();
  }
  render() {
    const { t } = this.props;
    const { folders, pages, loading, currentPage } = this.state;
    return (<div className="homepage-div">
      <div className="songDiv">
        <p className="page-title">{t('Select_music_folder')}</p>
        <p className="page-subtitle">{t('Music_folder_hint3')}</p>
        <p className="page-subtitle">{t('Music_folder_hint')}</p>
        <p className="page-subtitle">{t('Music_folder_hint2')}</p>
        <div className="search-container">
          <input ref={this.searchTxt} className="search-folder-input" type="text" placeholder={t('Search_placeholder')} onKeyDown={this._handleKeyDown}/>
          <div className="search-folder-button" onClick={this._searchFolders}>{t('Search')}</div>
        </div>
        <div className="search-options">
          <label className="search-option">
            <input ref={this.completedTick} type="checkbox" className="checkbox-value" onClick={this._onOptionsChanged} defaultChecked={true} />
            {t('show_completed')}
          </label>
          <label className="search-option">
            <input ref={this.blockedTick} type="checkbox" className="checkbox-value" onClick={this._onOptionsChanged} defaultChecked={true} />
            {t('show_blocked')}
          </label>
        </div>
        <Pager pages={pages} currentPage={currentPage} onPageChanged={this._onPageChanged} />
        {loading? <Loading />: <MusicFolderBrowse t={t} folders={folders} />}
        <Pager pages={pages} currentPage={currentPage} onPageChanged={this._onPageChanged} />
      </div>
    </div>);
  }
}

export default withTranslation()(Practice);
