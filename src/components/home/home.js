import React from 'react';
import { useTranslation } from 'react-i18next';
import SmoothScroll from '../shared/smoothScroll'
import UserStats from './components/userstats';
import AnnotateHelp from './components/annotateHelp';
import PointsHelp from './components/pointsHelp';
import Footbar from "../shared/footbar";
import ImgLang from "../shared/imgLang";
import AuthenticationBtn from "../shared/authenticationBtn";

function Section({ children, id, name }) {
  return <div id={id} name={name} className="homepage-div-wide">
    <div className="songDiv">
      <div className="hometitle-text">{name}</div>
      {children}
    </div>
  </div>;
}

/*
  Home: Module that renders the home section. It has the infographics and general info of the use case.
  props:
    user: object with info of logged user, or null if no logged user
 */
export default function Home({ user }) {
  const {t, i18n } = useTranslation();
  const lng = i18n.language.split('-')[0];
  return [<SmoothScroll key="scroll" navClass="home-section">
    {user? <Section name={t('Current_performance_title')}>
      <UserStats />
    </Section> : <Section name={t('Join_trompa')} titleName={t('Join_us')}>
      <AuthenticationBtn>
        <ImgLang className="flyer-img banner-img" lng={lng} image="banner.png" alt="banner" />
      </AuthenticationBtn>
    </Section>}
    <Section name={t('Pilot_workflow_title')}>
      <ImgLang className="flyer-img" lng={lng} image="workflow.png" alt="workflow"/>
    </Section>
    <Section name={t('Annotation_workflow_title')}>
      <AnnotateHelp t={t} />
    </Section>
    <Section name={t('Points_workflow_title')}>
      <PointsHelp t={t} />
    </Section>
  </SmoothScroll>,
  <Footbar key="footbar" />];
}

