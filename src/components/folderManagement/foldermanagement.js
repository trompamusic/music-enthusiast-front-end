import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { servercall } from '../../utils/services';
import MusicFolderBrowse from './components/musicFolderBrowse.js';
import Loading from "../shared/loading";

/*
  TODO: implementation of this module
  FolderManagement: Module that renders the campaigns created by user to be edited. It also implements the "create campaign"
  button.
  props:
    t: i18n method for translation based on current language.
 */
class FolderManagement extends React.Component {
  constructor(props) {
    super(props);
    this.searchTxt = React.createRef();
    this.state = {
      loading: false,
      folders: [],
    };
  }
  _searchFolders = (all) => {
    const val = this.searchTxt.current.value;
    if (all || (val.trim() && val.trim().length > 3)) {
      this.setState({loading: true});
      /*method to load campaigns created by logged user*/
      servercall('POST', 'getMymusicFolders', {contains: all ? '_null_' : this.searchTxt.current.value}, (data, err) => {
        const jsondata = err? [] : data.musicFolder;
        this.setState({folders: jsondata, loading: false});
      });
    }
  }
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this._searchFolders(false);
    }
  }
  componentDidMount() {
    this._searchFolders(true);
  }
  render() {
    const { t } = this.props;
    const { folders, loading } = this.state;
    return (<div className="homepage-div">
      <div className="songDiv">
        <p className="page-title">{t('Folder_Management')}</p>
      </div>
      <div className="songDiv">
        <div className="search-container">
          <input ref={this.searchTxt} className="search-folder-input" type="text" placeholder={t('Search_placeholder')} onKeyDown={this._handleKeyDown}/>
          <div className="search-folder-button" onClick={() => this._searchFolders(false)}>{t('Search')}</div>
          <Link to={'/trompa/rc/editfolder/fi=new'}><div className="search-folder-button">{t('New')}</div></Link>
        </div>
        {loading? <Loading />: <MusicFolderBrowse folders={folders}/>}
      </div>
    </div>);
  }
}

export default withTranslation()(FolderManagement);
