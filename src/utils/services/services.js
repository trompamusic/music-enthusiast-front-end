/* SERVER CALLS. CE CALLS + OUR OWN BACKEND GET/POST METHODS. */
import auth from 'solid-auth-client';
import { USER_AUTH } from "../constants.js";

const googleAuthentication = (callback) => {
  fetch(USER_AUTH.GOOGLE.AUTH, {
    method: 'POST',
  }).then(response => response.json()).then((data) => {
    if (data.prelogin_redirect) {
      window.location = data.url;
    }
  }).catch((err) => {
    console.log('error:', err);
    if (callback) callback('google login error');
  });
};

const solidAuthentication = (callback) => {
  auth.popupLogin({
    popupUri: process.env.PUBLIC_URL + "/auth-popup.html",
  }).then(userData => {
    if (userData) {
      auth.fetch(USER_AUTH.SOLID.AUTH, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + userData.authorization.id_token
        },
      }).then(response => response.json()).then((data) => {
        if (data.validation) {
          window.location = data.redirect_url;
        }
      }).catch(err=> console.log('error:', err));
    }
  });
};

export const userAuthentication = (provider) => {
  switch (provider) {
    case 'solid':
      solidAuthentication();
      break;
    case 'google':
      googleAuthentication();
      break;
    default:
      return;
  }
};

export const authenticatedUserLogin = (accepted, provider) => {
  const url = USER_AUTH[provider.toUpperCase()].ACCEPTED_TERMS;
  if (url) {
    auth.currentSession().then(userData => {
      const token = userData && userData.authorization && userData.authorization.id_token;
      const formData = new FormData();
      formData.append('terms_and_conditions', accepted);
      auth.fetch(url, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: formData
      }).then(response => response.json()).then((data) => {
        if (data.validation) {
          window.location = data.redirect_url;
        }
      }).catch(err=> console.log('error:', err));
    });
  }
}

export const logOut = () => {
  auth.logout().then(()=>{
    window.location.href = USER_AUTH.LOGOUT;
  }).catch(()=>{
    window.location.href = USER_AUTH.LOGOUT;
  });
};

export const servercall = (method, service, data, callback) => {
  const url = USER_AUTH.POST_PREFIX.concat(service);
  auth.currentSession().then(userData => {
    const body = new FormData();
    if (data) {
      Object.keys(data).forEach(k => {
        if (typeof(data[k]) === 'object') body.append(k, JSON.stringify(data[k]));
        else body.append(k, data[k]);
      });
    }
    const headers = { 'Accept': 'application/json' };
    if (userData && userData.authorization) headers.Authorization = 'Bearer ' + userData.authorization.id_token;
    auth.fetch(url, {
      mode: 'cors',
      method,
      headers,
      body
    }).then(response => response.json()).then(res => {
      callback(res, null);
    }).catch(err=> {
      console.log('server error:' + url, err);
      if (callback) callback(null, err);
    });
  });
};

export const analytics = (action) => {
  if (action) {
    servercall('POST', 'analytics', action, (data, err)=>{
      if (err) console.error('analytics:', err);
      // else console.log('analytics:', data);
    });
  }
};

export default {
  userAuthentication,
  authenticatedUserLogin,
  logOut,
  servercall,
  analytics
};
