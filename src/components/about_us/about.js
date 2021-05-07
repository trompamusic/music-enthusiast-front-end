import React from 'react';
import { useTranslation } from 'react-i18next';
import Footbar from "../shared/footbar";
import AuthenticationBtn from "../shared/authenticationBtn";

/*
  About: Module that renders about us section.
  props:
    user: object with user info. Null if no user is logged.
*/
export default function About({user}) {
  const { t } = useTranslation();
  return [
    <div key="maindiv" className="homepage-div">
      <div className="HD2">
        <div className="homepage-text" >
          <h1>{t('About_title')}</h1>
          <p>{t('About_content_1')}</p>
          <p>{t('About_content_2')}</p>
        </div>
        <div className="homepage-text" >
          <h1>{t('Try_yourself')}</h1>
          <div className="HPimg">
            <img  alt="crying_baby" src={process.env.PUBLIC_URL + '/img/cryingBaby.jpg'}></img>
            <label>
              (Taken from <a target="_blank" rel="noopener noreferrer" href="https://www.essentialparent.com/lesson/why-do-babies-cry-2171/?continuity=18135">Essential Parent</a> on 05.01.2020)
            </label>
          </div>
          <p>{t('About_content_3')}</p>
          <p>{t('About_content_4')}</p>
          <p>{t('About_content_5')}</p>
          <br />
          <div className="HPvideo">
            <video src={process.env.PUBLIC_URL + '/video/demo.mp4'} controls controlsList="nodownload">
              {t('Video_not_supported')}
            </video>
          </div>
          <p>{t('About_content_6')}</p>
          <p>{t('About_content_7')}</p>
          {user && user.userId?
            '' :
            <div className="about-login-button">
              <AuthenticationBtn><label>{t('register_login')}</label></AuthenticationBtn>
            </div>
          }
        </div>
      </div>
    </div>,
    <Footbar key="footbar" />
  ];
}