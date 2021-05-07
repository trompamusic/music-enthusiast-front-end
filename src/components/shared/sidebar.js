import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { mainMenu } from '../../utils/menu.js';
import { analytics, logOut } from "../../utils/services";
import AuthenticationBtn from "../shared/authenticationBtn";

/*
  Sidebar: module with sidebar for mobile version (with menu navbar)
    props:
      visible: flag to know if sidebar is visible or not.
      toggleVisibility: function to toggle sidebar visibility.
      user: logged user object, or null if no logged user
 */
export default function Sidebar({ visible, toggleVisibility, user }) {
  const [ t ] = useTranslation();
  const filteredMenu = mainMenu.filter(i => i.inMenu && ((user && user.userId) || i.public));
  const filteredUserMenu = mainMenu.filter(i => i.inUserMenu && (user && user.userId));
  return <div>
    <div id="left-menu" className={visible? "open" : "closed"}>
      <div className="header">
        <p id="header-title" onClick={toggleVisibility}>
          <Link to="/trompa/rc"><img width="200px" src={process.env.PUBLIC_URL + '/img/trompaLOGO.PNG'} alt="trompa_logo" onClick={() => analytics({ click: 'Home'})}/></Link>
        </p>
      </div>
      <div className="top">
        <nav>
          <ul>
            {filteredMenu.reverse().map(i => (<Link key={i.key} to={Array.isArray(i.link)? i.link[0] : i.link} onClick={() => {analytics({ click: i.key }); toggleVisibility();}}>
              <li className={"left-menu-item".concat(window.location.pathname.indexOf(i.link) >= 0? ' selected' : '')}>
                {t(i.key)}
              </li>
            </Link>))}
          </ul>
        </nav>
      </div>
      <div className="bottom">
        <nav>
          <ul>
            {filteredUserMenu.reverse().map(i => (
              <Link key={i.key} to={Array.isArray(i.link)? i.link[0] : i.link} onClick={() => {analytics({ click: i.key }); toggleVisibility();}}>
              <li className={"left-menu-item".concat(window.location.pathname.indexOf(i.link) >= 0? ' selected' : '')}>
                {t(i.key)}
              </li>
            </Link>))}
            <li id="leftMenu_Login" className="left-menu-item">
              {(user && user.userId)? <p onClick={() => logOut()}>{t('Logout')}</p> : <AuthenticationBtn>{<p>{t('Login')}</p>}</AuthenticationBtn>}
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div id="screen-mask" className={visible? "screen-mask-visible": "screen-mask-hidden"} onClick={toggleVisibility} />
  </div>;
}
