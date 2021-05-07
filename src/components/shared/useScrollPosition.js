import { useState, useRef, useLayoutEffect } from 'react';

const isBrowser = typeof window !== 'undefined';
function getScrollPosition({ element, useWindow }) {
  if (!isBrowser) return { x: 0, y: 0 };

  const target = element ? element.current : document.body;
  const position = target.getBoundingClientRect();
  return useWindow
      ? { x: window.scrollX, y: window.scrollY }
      : { x: position.left, y: position.top };
}

/*
  useScrollPosition: customized React hook effect for scrolling to title of each element.
 */
export default function useScrollPosition(effect, element, useWindow, wait) {
  const position = useRef(getScrollPosition({ useWindow }));
  const [throttleTimeout, setThrottleTimeout] = useState(null);

  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow });
    effect({ prevPos: position.current, currPos });
    position.current = currPos;
    setThrottleTimeout(null);
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (wait && throttleTimeout === null) setThrottleTimeout(setTimeout(callBack, wait));
      else if (!wait) callBack();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll)
  });
}