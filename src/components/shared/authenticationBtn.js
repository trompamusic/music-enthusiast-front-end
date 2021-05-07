import React, { useState } from "react";
import Popup from "./popup";
import { userAuthentication } from "../../utils/services";
import { authentication_providers } from "../../utils/constants.js";
import {useTranslation} from "react-i18next";

const AuthenticationTitle = (txt, close) => {
  return <div className="help-title">
    {txt}<div className="help-title-close-btn" onClick={close}>X</div>
  </div>;
};

const AuthenticationContent = (logoClicked) => {
  return <div className="providers-container">
    {authentication_providers.map(provider => 
      <div key={provider} className="provider-logo-container" title={provider}>
        <img className="provider-logo" src={`${process.env.PUBLIC_URL}/img/${provider}_logo.svg`} alt={provider} onClick={() => logoClicked(provider)} />
      </div>
    )}
  </div>
};

export default function AuthenticationBtn({children}) {
  const [visible, setVisibility] = useState(false);
  const [ t ] = useTranslation();
  const onLogoClick = (logo) => {
    setVisibility(false);
    userAuthentication(logo);
  };
  const content = AuthenticationContent(onLogoClick);
  const title = AuthenticationTitle(t('Select_auth_provider'), ()=>setVisibility(false));
  return <>
    {React.Children.map(children, child => React.cloneElement(child, { onClick: () => setVisibility(true) }))}
    <Popup visible={visible} title={title} content={content} size="80%" />
    </>;
};