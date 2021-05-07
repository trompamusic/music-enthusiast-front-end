import React from "react";
import { Link } from "react-router-dom";
import LanguageMenu from "./languageMenu";

/*
  Topbar: module with topbar for mobile version (with sandwich icon to open sidebar)
    props:
      languages: array with list of available languages
      user: logged user object, or null if no logged user
      menuClick: action when user clicks sandwich icon
 */
export default function Topbar({ languages, user, menuClick }) {
  return (<div id="topbar" className="logo">
    <div className="topleft">
      <img className="icon-menu" src={process.env.PUBLIC_URL + '/img/menu.png'} onClick={menuClick} alt="menu"/>
    </div>
    <div className="topcenter">
        <Link to="/trompa/rc"><img className="logo" src={process.env.PUBLIC_URL + '/img/trompaLOGO.PNG'} alt="trompa_logo" /></Link>
    </div>
    <LanguageMenu languages={languages} user={user} />
    {user? <div key="userName" className="user-name">{(user.username || user.name)}</div> : ''}
  </div>);
}
