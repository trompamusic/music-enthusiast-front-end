import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Link, animateScroll, scroller } from "react-scroll";
import useScrollPosition from "./useScrollPosition";

/*
  SmoothScroll: scroll for single page app used in home section. it scrolls between the elements, and scrolls back
  when clicking on up arrow.
*/
function SmoothScroll({ children, navClass }) {
  const [hideOnScroll, setHideOnScroll] = useState(true);
  const location = useLocation();
  useScrollPosition(({ prevPos, currPos }) => {
    const isShow = currPos.y > -10;
    if (isShow !== hideOnScroll) setHideOnScroll(isShow);
  });
  useEffect(() => {
    const scrollValue = new URLSearchParams(location.search).get('scroll');
    if (scrollValue) setTimeout(() => scroller.scrollTo('child_' + scrollValue), 100);
  },[location]);
  const width = 100/children.length + '%';
  return <div className="smooth-scroll-container">
    <div className="smooth-scroll-nav">
      {children.map((child, i) => <Link
        key={'link_'.concat(i)}
        className={'smooth-scroll-title '.concat(navClass? navClass : '')}
        activeClass={'smooth-scroll-title '.concat(navClass? navClass : '', ' active')}
        to={'child_'.concat(i)}
        spy={true}
        smooth={true}
        offset={0}
        duration={500}
        style={{ width }}
      >
        {child.props.titleName || child.props.name}
      </Link>)}
    </div>
    <div className="smooth-scroll-sections">
      <div className={'back-button'.concat(hideOnScroll? ' hidden' : ' visible')}>
        <img onClick={() => animateScroll.scrollToTop({ duration: 250 })} src={process.env.PUBLIC_URL + '/img/return_button.svg'} alt="back"/>
      </div>
      {children.map((child, i) => React.cloneElement(child, {
        className: child.props.className? child.props.className : '',
        id: 'child_'.concat(i),
        key: 'child_'.concat(i)
      }))}
    </div>
  </div>;
}

export default SmoothScroll;