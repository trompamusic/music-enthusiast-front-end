import React from 'react';
import { withTranslation } from 'react-i18next';
import {servercall} from "../../utils/services";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import langs from '../../utils/languages.json';
import Loading from '../shared/loading';


/*
  getUserPromise: promise for getting full user information of the currently logged user. returns empty object {}
  if no user is logged
*/
const getUserPromise = () => (new Promise((resolve, reject)=> {
  servercall('POST', 'getuser', { type: 'full'}, (data, err) => {
    if (err) resolve({});
    resolve(data);
  });
}));

/*
  UserManagement:
    props:
      summarized: flag to render basic / complete user configuration settings.
      onSaved: additional action to be performed after updating user information.
      t: i18n method for translation based on current language.
 */
class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.languages = langs.map(l => ({ label: l.nativeName, value: l.code }));
    this.countries = countryList().getData();
    this.unRef = React.createRef();
    this.bpRef = React.createRef();
    this.mlRef = React.createRef();
    this.state = { loading: true, user: null, newUser: {}, validUser: true, countries: this.countries, languages: this.languages };
  }
  async componentDidMount() {
    const { user } = await getUserPromise();
    const state = { user, loading: false };
    if (user.allowContact === -1) state.newUser = { allowContact: false };
    this.setState(state);
  }
  _birthPlaceChanged = (e) => {
    const { newUser } = this.state;
    const newUserD = { ...newUser };
    newUserD['birthPlace'] = e.label;
    this.setState({ newUser: newUserD });
  };
  _motherLanguageChanged = (e) => {
    const { newUser } = this.state;
    const newUserD = { ...newUser };
    newUserD['motherLanguage'] = e.value;
    this.setState({ newUser: newUserD });
  };
  _otherLanguagesChanged = (e) => {
    const { newUser } = this.state;
    const newUserD = { ...newUser };
    newUserD['otherLanguages'] = e? e.map(l => l.value) : [];
    this.setState({ newUser: newUserD });
  };
  _valueChanged = (e) => {
    const { user, newUser } = this.state;
    if (user) {
      const newUserD = { ...newUser };
      if (e.currentTarget.type === "text")
        newUserD[e.currentTarget.id] = e.currentTarget.value;
      else if (e.currentTarget.type === "checkbox")
        newUserD[e.currentTarget.id] = e.currentTarget.checked;
      this.setState({ newUser: newUserD, validUser: true });
    }
  };
  _savePreferences = () => {
    const { newUser, user } = this.state;
    if (Object.keys(newUser).length > 0) {
      const mergedUser = { ...user, ...newUser };
      if (!mergedUser.username) this.unRef.current.classList.add('missing');
      else this.unRef.current.classList.remove('missing');
      if (!mergedUser.birthPlace) this.bpRef.current.classList.add('missing');
      else this.bpRef.current.classList.remove('missing');
      if (!mergedUser.motherLanguage) this.mlRef.current.classList.add('missing');
      else this.mlRef.current.classList.remove('missing');
      if (mergedUser.username && mergedUser.birthPlace && mergedUser.motherLanguage) {
        this.setState({loading: true});
        servercall('POST', 'updateuser', { ...newUser, allowContact: mergedUser.allowContact }, (data, err) => {
          if (!err) {
            if (this.props.onSave) {
              this.setState({user: mergedUser, loading: false, newUser: {}, validUser: false});
              this.props.onSave(mergedUser);
            }
            else window.location = '/trompa/rc/settings';
          } else {
            this.setState({user: mergedUser, loading: false, newUser: {}, validUser: false});
          }
        });
      }
    }
  };
  render() {
    const { t, summarized } = this.props;
    const { loading, newUser, user, countries, languages, validUser } = this.state;
    const countryValue = (newUser && newUser.birthPlace) || (user && user.birthPlace);
    const languageValue = (newUser && newUser.motherLanguage) || (user && user.motherLanguage);
    const otherLanguagesValue = (newUser && newUser.otherLanguages) || (user && user.otherLanguages);
    return loading? <Loading/> : <div className="homepage-div">
      <div className="songDiv">
        <div className="property-container">
          <div className="property-title">{t('Username')}*:</div>
          <div ref={this.unRef} className="property-value">
            <input id="username" className={'search-folder-input'.concat(validUser? '': ' invalid')} type="text" defaultValue={user && user.username} onChange={this._valueChanged}/>
            {validUser? '' : <div className="user-error-txt">
              {t('Username_already_exists')}
            </div>}
          </div>
        </div>
        <div className="property-container">
          <div className="property-title">{t('Birth_place')}*:</div>
          <div ref={this.bpRef} className="property-value">
            <Select
              id="birthPlace"
              options={countries}
              value={{label: countryValue, Value: countryValue && countryList().getValue(countryValue)}}
              onChange={this._birthPlaceChanged}
            />
          </div>
        </div>
        <div className="property-container">
          <div className="property-title">{t('Mother_language')}*:</div>
          <div ref={this.mlRef} className="property-value">
            <Select
              id="motherLanguage"
              options={languages}
              value={languages.find(l => l.value === languageValue)}
              onChange={this._motherLanguageChanged}
            />
          </div>
        </div>
        <div className="property-container">
          <div className="property-title">{t('Other_languages')}:</div>
          <div className="property-value">
            <Select
              isMulti
              id="otherLanguages"
              options={languages}
              value={otherLanguagesValue && otherLanguagesValue.map(v => languages.find(l => l.value === v))}
              onChange={this._otherLanguagesChanged}
            />
          </div>
        </div>
        {!summarized ? <>
          <div className="property-container">
            <div className="property-title"></div>
            <div className="property-value checkbox">
              <label>
                <input id="sendMail" onClick={this._valueChanged} type="checkbox" className="checkbox-value" defaultChecked={user && user.sendMail} />
                {t('Sendmails_checkbox')}
              </label>
            </div>
          </div>
          {/*<div className="property-container">*/}
          {/*  <div className="property-title"></div>*/}
          {/*  <div className="property-value checkbox">*/}
          {/*    <label>*/}
          {/*      <input id="researchData" onClick={this._valueChanged} type="checkbox" className="checkbox-value" defaultChecked={user && user.researchData} />*/}
          {/*      {t('Researchdata_checkbox')}*/}
          {/*    </label>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </> : <></>}
        <div className="property-container">
          <div className="property-title"></div>
          <div className="property-value checkbox">
            <label>
              <input id="allowContact" onClick={this._valueChanged} type="checkbox" className="checkbox-value" defaultChecked={user && user.allowContact>0} />
              {t('AllowContact_checkbox')}<sup>1</sup>
            </label>
          </div>
        </div>
        <div className="foot-note">
          <sup>1</sup>{t('Economic_compensation_available')}
        </div>
        <div className="save-user-info"><div className={'search-folder-button '.concat(Object.keys(newUser).length > 0? '' : 'disabled')} onClick={this._savePreferences}>{t('Save_preferences')}</div></div>
      </div>
    </div>;
  }
}

export default withTranslation()(UserManagement);
