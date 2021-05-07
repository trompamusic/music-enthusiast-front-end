import React from 'react';
import { Switch, Route } from "react-router-dom";
import { mainMenu } from '../../utils/menu.js';
import Loading from "../shared/loading";

/*
Main: module for rendering main section of the application. It renders a specific module according to routing path. For
module rendering info, check object in ../../utils/menu.js
props:
  user: null if no logged user, otherwise an object with user info.
  loading: wait for user info loading.
 */
export default function Main({ user, loading }) {
  if (loading) return <div id="menuContainer">
    <Loading />
  </div>;
  const filteredMenu = user? mainMenu : mainMenu.filter(i => i.public);
  return (<div id="menuContainer">
    <Switch>
      {filteredMenu.map(r => {
        const Module = r.module;
        if (Array.isArray(r.link)) {
            return r.link.map((l,i) => (<Route key={''.concat(r.key,'_',i)} path={l}>
              <Module user={user} />
            </Route>));
        }
        else {
          return (<Route key={r.key} path={r.link}>
            <Module user={user} />
          </Route>);
        }
      })}
    </Switch>
  </div>);
}
