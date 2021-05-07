import React  from 'react';
import { useTranslation } from 'react-i18next';
import ImgLang from "../../shared/imgLang";

const levelHelp = [
  {
    src: 'level3/freeMood.gif',
    txt: 'h_freeMood'
  },
  {
    src: 'level3/arousal.gif',
    txt: 'h_arousal'
  },
  {
    src: 'level3/valence.gif',
    txt: 'h_valence'
  },
  {
    src: 'level3/tag.gif',
    txt: 'h_tag'
  },
  {
    src: 'level3/stats.gif',
    txt: 'h_stats',
    class: 'reduced-sides'
  },
];

/*
  Help: React hook that renders additional help sliders in help popup.
*/
export default function Help() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language.split('-')[0];

  return levelHelp.map((l) =>
    [
      <ImgLang key={l.src} className={l.class? l.class : ''} style={{maxWidth: '100%'}} alt={l.src} image={'help/' + l.src} lng={lng} />,
      t(l.txt)
    ]
  );
}