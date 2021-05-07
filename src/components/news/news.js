import React, {useEffect, useState} from 'react';
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { scroller } from "react-scroll";
import Footbar from "../shared/footbar";
import { servercall } from "../../utils/services";
import Loading from "../shared/loading";

const getNewsPromise = () => (new Promise((resolve, reject)=> {
  servercall('POST', 'getNews', null, (data, err) => {
    if (err) resolve([]);
    resolve(data);
  });
}));

export default function News() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lng = i18n.language.split('-')[0];
  const [newsList, setNews] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const result = await getNewsPromise();
      setNews(result);
      const scrollValue = new URLSearchParams(location.search).get('id');
      if (scrollValue) scroller.scrollTo(scrollValue);
    }
    fetchData();
  }, [location]);
  if (!newsList) return <Loading/>;

  return <>
    <div key="main-div" className="homepage-div">
      {newsList.map((n, i) =>
        <div id={n.guid} key={n.guid} className="newsDiv" dangerouslySetInnerHTML={{ __html: n[lng] || n['en'] }} />
      )}
    </div>
    <Footbar key="footbar" />
  </>;
}
