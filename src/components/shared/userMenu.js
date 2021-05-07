import React, { useState, useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {analytics, logOut} from "../../utils/services";
import AuthenticationBtn from "./authenticationBtn";

/*
  UserMenu: module with user menu links to user settings/logout
    props:
      user: logged user object, or null if no logged user
      menu: Visible menu items
      t: i18n method for translation based on current language.
 */
export default function UserMenu({ user, menu, t }) {
  const location = useLocation();
  const [userMenuVisible, setUserMenuVisibility] = useState(false);
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    if (containerRef && containerRef.current) {
      Array.prototype.slice.call(containerRef.current.getElementsByClassName('user-menu-item')).forEach((li) => {
        if (li.id !== 'Home') {
          if (location.pathname.indexOf(li.dataset.url) >= 0) li.classList.add('current');
          else li.classList.remove('current');
        } else {
          const loc = location.pathname.replace('/trompa', '').replace('/rc', '').replace('/', '');
          if (loc === '') li.classList.add('current');
          else li.classList.remove('current');
        }
      });
    }
  });
  return user?
    <div key="user-btn" className="user-btn-container" onPointerEnter={()=>setUserMenuVisibility(true)} onPointerLeave={()=>setUserMenuVisibility(false)}>
      <div className="usr-txt">{user.username || user.name} <span>&#9662;</span></div>
      <div className={'user-menu'.concat(userMenuVisible? ' visible' : '')}>
        <div className="language-list">
          <ul ref={containerRef}>
            {menu.map(i => (<Link key={i.key} to={Array.isArray(i.link)? i.link[0] : i.link} onClick={()=>{analytics({ 'click': i.key }); setUserMenuVisibility(false);}}>
              <li id={i.key} data-url={Array.isArray(i.link)? i.link[0] : i.link} className="user-menu-item">
                {t(i.key)}
              </li>
            </Link>))}
            <li id="logout" className="user-menu-item logout" onClick={() => logOut()}>{t('Logout')}</li>
          </ul>
        </div>
      </div>
    </div> :
    <AuthenticationBtn><div className="login-button">{t('Login')}</div></AuthenticationBtn>;
}