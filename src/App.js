import React  from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from 'i18next-browser-languagedetector';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Main, Sidebar, Topbar, Topbarmenu, SessionPopup } from './components';
import i18nextParams from './i18next';
import { servercall } from './utils/services';
import ScrollToTop from "./components/shared/scrollToTop";
import Loading from "./components/shared/loading";
import { Terms } from "./components";

/*
  getUserPromise: promise for getting basic information of the currently logged user. returns empty object {} if no user is logged
*/
const getUserPromise = () => (new Promise((resolve, reject)=> {
  servercall('POST', 'getuser', null, (data, err) => {
    if (err) resolve({});
    resolve(data);
  });
}));


/*
  Main React module. It loads header, footer, sidebar, popup window module and main section according to the routing path.
  props: none
  state:
    sidebarVisible: true if sidebar is visible, otherwise is false.
    user: null if no user is logged, otherwise object with user basic info
    loading: true if waiting for getUserPromise response, false otherwise.
    popupVisible: true if initial popup is visible, otherwise is false. (popup with user configuration info)
 */
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.searchTxt = React.createRef();
    this.state = {
      sidebarVisible: false,
      user: null,
      loading: true,
      popupVisible: false,
    };
  }
  setSidebarVisibility = (sidebarVisible) => { this.setState({ sidebarVisible }); }
  async componentDidMount() {
    const { user } = await getUserPromise();
    i18n.use(detector).use(initReactI18next).init(i18nextParams).then(()=>{
      const { resources } = i18nextParams;
      let defLang = i18n.language.split('-')[0];
      if (resources[defLang] === undefined) defLang = 'en';
      const state = { loading: false };
      if (user) {
        if (user.language) defLang = user.language;
        else servercall('POST', 'updateuser', { lang: defLang });
        state.user = user;
        state.popupVisible = user && user.allowContact === -1;
      }
      i18n.changeLanguage(defLang);
      this.setState(state);
    });
  }
  render() {
    const { user, sidebarVisible, loading, popupVisible } = this.state;
    if (loading) return <Loading />;
    return (
      <Router>
        <Switch>
          <Route path="/trompa/rc/terms/provider=:provider">
            <Terms languages={Object.keys(i18nextParams.resources)} />
          </Route>
          <Route path="/">
            <Topbar languages={Object.keys(i18nextParams.resources)} user={user} menuClick={() => this.setSidebarVisibility(!sidebarVisible)} />
            <Topbarmenu languages={Object.keys(i18nextParams.resources)} user={user} menuClick={() => this.setSidebarVisibility(!sidebarVisible)} />
            <Sidebar user={user} visible={sidebarVisible} toggleVisibility={() => this.setSidebarVisibility(!sidebarVisible)} />
            <Main loading={loading} user={user} />
            <SessionPopup visible={popupVisible} updateUser={(user) => this.setState({ user })} setVisibility={(popupVisible)=>this.setState({ popupVisible })} />
          </Route>
        </Switch>
        <ScrollToTop />
      </Router>
    );
  }
}