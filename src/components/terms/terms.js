import React from 'react';
import { useParams } from "react-router-dom";
import { authenticatedUserLogin } from "../../utils/services";
import LanguageMenu from "../shared/languageMenu";
import {useTranslation, Trans} from "react-i18next";


export default function Terms({ languages }) {
  const { provider } = useParams();
  const [ t, i18n ] = useTranslation();
  const lang = i18n.language !== 'es' && i18n.language !== 'en'? 'en' : i18n.language;
  return <>
    <div id="topbar-menu" className="logo">
      <div className="topleft">
        <img className="logo" src={process.env.PUBLIC_URL + '/img/trompaLOGO.PNG'} alt="trompa_logo" />
      </div>
      <div className="topcenter" />
      <div className="top-user-name" />
      <LanguageMenu languages={languages} user={null} />
    </div>
    <div className="content">
      <div id="terms-and-conditions-title">{t('terms_and_conditions_title')}</div>
      <div id="terms-and-conditions-text">
        <table align="center" className="terms-conditions-table">
          <tbody>
          <tr>
            <td>{t('Research_name')}</td>
            <td><b>TROMPA:</b> Towards Richer Online Music Public-domain Archives</td>
          </tr>
          <tr>
            <td>{t('Funded_by')}</td>
            <td>EU - HORIZON 2020, Grant Agreement 770376</td>
          </tr>
          <tr>
            <td>{t('Duration')}</td>
            <td><b>May 1st 2018 - 30 April 2021</b></td>
          </tr>
          <tr>
            <td colSpan="2"><b>{t('Researcher_details')}</b></td>
          </tr>
          <tr>
            <td>{t('Name')}</td>
            <td>Emilia Gómez Gutiérrez</td>
          </tr>
          <tr>
            <td>{t('Affiliation')}</td>
            <td>Universitat Pompeu Fabra</td>
          </tr>
          <tr>
            <td>{t('Address')}</td>
            <td>Carrer de Tànger, 122-140, 08018, Barcelona, Spain</td>
          </tr>
          <tr>
            <td>{t('Email')}</td>
            <td><a href="mailto:emilia.gomez@upf.edu">emilia.gomez@upf.edu</a></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div id="terms-and-conditions-text">
        <p>{t('I_hereby_confirm')}</p>
        <ul className="terms-conditions-list">
          <li><Trans i18nKey="accepted_terms_of_use">
            I have read and accept the <a rel="noopener noreferrer" target="_blank" href={"/trompa/pg/feedback_check/legal/terms-of-use?lang=" + lang}>TERMS OF USE</a> of the TROMPA Music Enthusiasts pilot platform.
          </Trans>
          </li>
          <li><Trans i18nKey="accepted_privacy_policy">
            I have read and accept the <a rel="noopener noreferrer" target="_blank" href={"/trompa/pg/feedback_check/legal/privacy-policy?lang=" + lang}>Privacy Policy</a> of the TROMPA Music Enthusiasts pilot.
          </Trans>
          </li>
          <li><Trans i18nKey="accepted_information_sheet">
            I have read the <a rel="noopener noreferrer" target="_blank" href={process.env.PUBLIC_URL + '/TROMPA-Information_Sheet-music_enthusiasts_' + lang + ".pdf"}>information sheet</a> regarding the TROMPA experiments I will participate in.
          </Trans>
          </li>
          <li>{t('formulate_questions')}</li>
          <li>{t('project_information_received')}</li>
          <li>{t('voluntary_participation')}</li>
          <li>{t('consent_give')}</li>
          <li>{t('older_than_14')}</li>
        </ul>
      </div>
      <div id="terms-buttons">
        <button className="accept_terms" onClick={()=>authenticatedUserLogin(true, provider)}>{t('Accept')}</button>
        <button className="reject_terms" onClick={()=>window.location.href = '/trompa/rc'}>{t('Reject')}</button>
      </div>
    </div>
  </>
}