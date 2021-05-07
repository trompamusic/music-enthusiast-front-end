import React, { useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { analytics } from '../../utils/services';

/*
  MenuNav: module with navbar with routing
    props:
      menu: Visible menu items
      t: i18n method for translation based on current language.
 */
export default function MenuNav({ menu, t }) {
  const location = useLocation();
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    Array.prototype.slice.call(containerRef.current.getElementsByClassName('top-menu-item')).forEach((li)=> {
      if (li.id !== 'Home') {
        if (location.pathname.indexOf(li.dataset.url) >= 0) li.classList.add('selected');
        else li.classList.remove('selected');
      } else {
        const loc = location.pathname.replace('/trompa', '').replace('/rc','').replace('/','');
        if (loc === '') li.classList.add('selected');
        else li.classList.remove('selected');
      }
    });
  });
  return <ul ref={containerRef}>
    {menu.map(i => (<Link key={i.key} to={Array.isArray(i.link)? i.link[0] : i.link} onClick={() => analytics({ 'click': i.key })}>
      <li id={i.key} data-url={Array.isArray(i.link)? i.link[0] : i.link} className={"top-menu-item"}>
        {t(i.key)}
      </li>
    </Link>))}
  </ul>;
}