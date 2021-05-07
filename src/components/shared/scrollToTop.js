import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/*
  ScrollToTop: React hook customized effect that scrolls to the top of the screen
*/
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
