import React from "react";
import { useTranslation } from 'react-i18next';
import UserManagement from "../userManagement";

/*
  SessionPopup: module with form to get minimum user configuration. This popup is mandatory for first time user login.
  props:
    visible: flag to determine if popup most be shown or not.
    setVisibility: function to set popup visibility.
    updateUser: function to update user information in client-side variable.
 */
export default function SessionPopup({ visible, setVisibility, updateUser }) {
  const { t } = useTranslation();
  if (!visible) return <></>;
  return <>
    <div id="popup-container" className={visible? "visible" : "hidden"}>
      <div id="popup-dialog" style={{ width: '50%' }}>
        <h3 id="popup-title">{t('Complete_user_info')}</h3>
        <UserManagement summarized onSave={(user)=>{
          updateUser(user);
          setVisibility(false);
          return false;
        }}/>
      </div>
    </div>
    <div id="screen-mask" className={visible? "screen-mask-visible": "screen-mask-hidden"} />
  </>;
}
