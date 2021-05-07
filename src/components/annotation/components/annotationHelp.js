import React, { useState } from 'react';
import Levels from '../../levels';
import { useTranslation } from 'react-i18next';
import ImgLang from "../../shared/imgLang";

const defaultHelpList = [
  {
    src: 'playSong.gif',
    txt: 'h_play_button_text',
  },
  {
    src: 'generalOpts.gif',
    txt: 'h_general_options',
  },
  {
    src: 'perceivedEvoked.png',
    txt: 'h_perceived_vs_evoked',
    class: 'reduced-sides'
  },
  {
    src: 'helpMenu.png',
    txt: 'h_help_icon_text',
  },
];

/*
  getDefaultHelp: renders default help based on the defaultHelpList array
 */
const getDefaultHelp = (lng, t) =>
  defaultHelpList.map(l => [
    l.module? l.module(t) : <ImgLang className={l.class? l.class : ''} style={{ maxWidth: '100%' }} key={l.src} alt={l.src} image={'help/' + l.src} lng={lng} />,
    t(l.txt)
  ]);

/*
  dots: Renders slider dots and sets the selected slider dot.
 */
const dots = (current, length) => {
  const d = [];
  for (let i = 0; i < length; i++) {
    d.push(<span key={i} className={'dot'.concat(i === current? ' selected' : '')}></span>);
  }
  return d;
};

/*
  sliderClass: It returns css classes for each slider type based on three states: previous, current, next.
 */
const sliderClass = (i, c) => {
  const v = i-c;
  switch (v) {
    case -1: return ' previous';
    case 0: return ' current';
    case 1: return ' next';
    default: return '';
  }
};

/*
  AnnotationHelp: Module with the help Popup. It contains the tutorial for users.
  props:
    annotationLvl: the level of the current annotation type, based on the campaign. (default: 3)
    onClose: additional action when popup is closed.
 */
export default function AnnotationHelp({ annotationLvl, onClose }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language.split('-')[0];
  const [current, setCurrent] = useState(0);
  const help = getDefaultHelp(lng, t);
  help.splice(3, 0, ...Levels['Level'.concat(annotationLvl)].Help());
  const last = current + 1 === help.length;
  return <>
    <div className="inhelp-container">
      {help.map((l,i) => <div className={'help-section'.concat(sliderClass(i, current))} key={i}>
        <div className="help-top">{l[0]}</div>
        <div className="help-bottom">{l[1]}</div>
      </div>)}
    </div>
    <div className="dots-container">{dots(current, help.length)}</div>
    {current >0? <button className="button normal-button" onClick={() => setCurrent(current - 1)}>
      {t('Previous')}
    </button> : ''}
    <button className="button close-button" onClick={()=>{
      if (last) onClose();
      else setCurrent(current + 1);
    }}>
      {last? t('Close') : t('Next')}
    </button>
  </>;
}