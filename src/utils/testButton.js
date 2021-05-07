import React  from "react";
import { servercall } from './services';
/*
  Topbarmenu: module with topbar for web version (with menu navbar)
    props:
      languages: array with list of available languages
      user: logged user object, or null if no logged user
 */
export default function TestButton() {
  return <button onClick={() => {
    servercall('POST', 'ceupdate', null, (res,err) => {
      if (err) console.log(err);
      else console.log(res);
    });
  }}>QueryCE</button>;
}
