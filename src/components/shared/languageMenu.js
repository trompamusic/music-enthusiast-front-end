import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-country-flag";
import { servercall } from "../../utils/services";
import { countryCodes } from "../../i18next";

/*
  LanguageMenu: module with language list with flags to select platform language
    props:
      languages: array with list of available languages
      user: logged user object, or null if no logged user
 */
export default function LanguageMenu({ languages, user }) {
  const [ t, i18n ] = useTranslation();
  const [langMenuVisible, setLangMenuVisibility] = useState(false);
  const lng = i18n.language.split('-')[0];
  const languageItemClicked = (key) => {
    i18n.changeLanguage(key);
    setLangMenuVisibility(false);
    if (user) {
      servercall('POST', 'updateuser', { lang: key });
    }
  };
  return <div key="lngContainer" className="topright">
    <div className="user-button">
      <div className="lng-image-container" onClick={()=>setLangMenuVisibility(true)}>
        <div className="btn-language-icon">
          <ReactCountryFlag countryCode={countryCodes[lng]} svg style={{ width: '20px' }} title={lng} />
        </div>
      </div>
      <div className={'language-menu'.concat(langMenuVisible? ' visible' : '')}>

        <div className="language-list">
          <ul>
            {languages.map(l => <li
                key={l}
                onClick={() => languageItemClicked(l)}
                className={'user-menu-item '.concat(lng === l? 'selected' : '')}
            >
              <ReactCountryFlag countryCode={countryCodes[l]} svg style={{ width: '15px' }} title={lng} /> {t('lang_'.concat(l))}
            </li>)}
          </ul>
        </div>
        <div className="background-menu" onClick={()=>setLangMenuVisibility(false)}></div>
      </div>
    </div>
  </div>;
}
