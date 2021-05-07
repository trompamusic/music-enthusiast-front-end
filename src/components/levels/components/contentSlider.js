import React, { useState } from 'react';

export default function ContentSlider({ children, title }) {
  const [count, setCount] = useState(0);
  return <div className="slider-container">
    <div className="slider-title">
      {title}
    </div>
    <div className="left-nav" onClick={()=>setCount(count > 0 ? count - 1 : children.length - 1)}>
      <img id="arrow-img" src={process.env.PUBLIC_URL + '/img/arrowLActive.png'} alt="left" />
    </div>
    {children.map((child, i) => <div key={child.key} className={'main-nav'.concat(i === count? ' selected' : '')}>
      {child}
    </div>)}
    <div className="right-nav" onClick={()=>setCount(( count + 1 ) % children.length)}>
      <img id="arrow-img" src={process.env.PUBLIC_URL + '/img/arrowRActive.png'} alt="right" />
    </div>
  </div>;
}