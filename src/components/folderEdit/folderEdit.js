import React from 'react';
import { Link } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import { MultiModalComponent } from 'trompa-multimodal-component';

/*
  TODO: implementation of this module
  FolderEdit: Module that renders the CRUD for the selected campaign. This module uses the Multimodal component to add
  new songs into the campaigns.
  props:
    t: i18n method for translation based on current language.
*/
class FolderEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedTracks: [] };
    this.nameTxt = React.createRef();
  }
  _removeItem = (nodeId) => {
    const { selectedTracks } = this.state;
    this.setState({ selectedTracks: selectedTracks.filter(t => t.identifier !== nodeId) });
  };
  _nodeClicked = (node) => {
    const { selectedTracks } = this.state;
    console.log('User has clicked on:', node);
    this.setState({ selectedTracks: selectedTracks.concat(node) });
  };
  _saveFolder = () => {
    const folderName = this.nameTxt.current.value;
    const { selectedTracks } = this.state;
    if (folderName !== '' && selectedTracks.length > 0) {
      // TO DO: Add service to upload folder
      // { folderName: folderName, songs: selectedTracks }
      // After saving, redirect to /trompa/rc/managefolders
      window.location.href = '/trompa/rc/managefolders';
    }
  };
  render() {
    const { t } = this.props;
    const { selectedTracks } = this.state;
    return <div className="folder-edit-container">
      <div className="track-list">
        <div className="track-list-container">
          <div className="action-buttons">
            <input ref={this.nameTxt} className="attrib-folder-input" type="text" placeholder={t('Name_placeholder')} />
          </div>
          <div className="list">
            <div className="list-item title">
              {t('Current_songs_list')}
            </div>
            {selectedTracks.map((track, i) => <div className="list-item" key={track.name + i}>
              <div className="track-name">{track.name}</div>
              <div className="track-button" onClick={()=>this._removeItem(track.source)}>X</div>
            </div>)}
          </div>
          <div className="action-buttons">
            <div className="search-folder-button" onClick={() => this._saveFolder()}>{t('Save')}</div>
            <Link to={'/trompa/rc/managefolders'} ><div className="search-folder-button">{t('Cancel')}</div></Link>
          </div>
        </div>
      </div>
      <div className="track-search">
        <MultiModalComponent
            onResultClick={node => this._nodeClicked(node)}
            filterTypes={["AudioObject", "VideoObject"]}
            disableFilters
        />
      </div>
    </div>;
  }
}

export default withTranslation()(FolderEdit);