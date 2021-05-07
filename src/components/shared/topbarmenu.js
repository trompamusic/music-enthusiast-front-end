import React  from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { mainMenu } from '../../utils/menu.js';
import LanguageMenu from "./languageMenu";
import MenuNav from "./menuNav";
import UserMenu from "./userMenu";

/*
  Topbarmenu: module with topbar for web version (with menu navbar)
    props:
      languages: array with list of available languages
      user: logged user object, or null if no logged user
 */
export default function Topbarmenu({ languages, user }) {
  const [ t ] = useTranslation();
  return (<div id="topbar-menu" className="logo">
    <div className="topleft">
      <Link to="/trompa/rc"><img className="logo" src={process.env.PUBLIC_URL + '/img/trompaLOGO.PNG'} alt="trompa_logo" /></Link>
    </div>
    <div className="topcenter">
      <nav>
        <MenuNav menu={mainMenu.filter(i => i.inMenu && (user || i.public)).reverse()} user={user} t={t} />
      </nav>
    </div>
    <div className="top-user-name">
      <UserMenu user={user} menu={mainMenu.filter(i => i.inUserMenu)} t={t} />
    </div>
    <LanguageMenu languages={languages} user={user} />
  </div>);
}
