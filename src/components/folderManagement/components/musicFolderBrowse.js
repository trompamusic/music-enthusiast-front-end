import React from "react";
import { Link } from "react-router-dom";

const buttonBackgroundStyle = (img) => ({ backgroundImage: "url('" + process.env.PUBLIC_URL + '/img/' + img + "')" });

/*
  MusicFolderBrowse: module that loads "folder" icon for campaign cards.
  props:
    folders: list of campaigns created by logged user
 */
export default function MusicFolderBrowse({ folders }) {
  return <div id="music-folders-container">
    {folders.map(f =>
      <div key={f.folderId} className="music-folder-div">
        <img className="music-directory-img" src={process.env.PUBLIC_URL + '/img/musicFolder.png'} alt="music folder"/>
        <p className="music-folder-title">{f.name}</p>
        <div className="folder-buttons-container">
          <Link style = {buttonBackgroundStyle('view.svg')} className="folder-buttons folder-viewstats" to={'/trompa/rc/folderstats/fi='.concat(f.folderId)}/>
          <Link style = {buttonBackgroundStyle('edit.svg')} className="folder-buttons folder-edit" to={'/trompa/rc/editfolder/fi='.concat(f.folderId)}/>
        </div>
      </div>)}
  </div>;
}