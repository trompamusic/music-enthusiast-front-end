# Music enthusiasts use case pilot
This repository has the front-end developed for the TROMPA Music Enthusiasts use case. It has been created using [Create React App](https://github.com/facebook/create-react-app). You can check the working pilot in [https://ilde.upf.edu/trompa](https://ilde.upf.edu/trompa).

## Requirements
This app requires a customized back-end to work. Still, it can be used with dummy data setting the environment variables as described further in this document.

## Use
In the project directory, you can run:
### `npm start`
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console. Please set the environment variables described below before starting the app.

### `npm run build`
Builds the app in the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.<br />
Please set the environment variables described below before building the app.

## Configuration
The app can work in both development and production mode. The mode can be managed through environment variables. The backend calls can be configured as well.
### Environment variables
You can manage the behavior of the pilot through the following enviroment variables. These variables can be passed through the command line or using the `.env` file.
#### REACT_APP_DEVELOPMENT
By default, this pilot runs in deployment mode (flag **REACT_APP_DEVELOPMENT** disabled). You can enable this flag to run the pilot in "development mode" (without the need of querying any data to a server). If this flag is **true**, all the server methods are replaced by dummy methods specified in `src/utils/services/testing_environment.js` to simulate data queried from server.

#### REACT_APP_MUZIEKWEB_CUSTOM
This flag enables the custom Muziekweb media player designed specifically for the TROMPA pilot. This media player only works with URLs previously authorized by Muziekweb. If your URL is not authorized, you still can use the media player for visual testing, but no audio will be played.

#### REACT_APP_MUZIEKWEB_REGISTERED
Muziekweb scripts only work in registered sites. If you want to use the custom Media Player with Muziekweb resources, you need to ask Muziewkweb to register your URL, and then enable this flag. **WARNING:** IF YOU ENABLE THIS FLAG AND YOUR SITE HAS NOT BEEN AUTHORIZED BY MUZIEKWEB, THE MEDIA PLAYER WILL FAIL.

#### REACT_APP_AUTH_PROVIDERS
Comma-separated list of authentication providers. By default, this pilot implements both Solid and Google authentication (`REACT_APP_AUTH_PROVIDERS = solid,google`).
For both providers, backend service must validate if it is a new user or a previously registered user through the POST service specified by `REACT_APP_<PROVIDER>_AUTH`. In case users need to accept terms and conditions prior to backend registration, new users can be redirected to/rc/terms/provider=google, while previously registed users can be redirected to main page. In case of using terms and conditions, `REACT_APP_<PROVIDER>_ACCEPTED_TERMS` is the POST service to call when users accept terms and conditions. Default values for these variables are:
```
REACT_APP_GOOGLE_AUTH = /trompa/action/googlelogin
REACT_APP_GOOGLE_ACCEPTED_TERMS = /trompa/action/googleloginredirect
REACT_APP_SOLID_AUTH = /trompa/action/solidloginredirect
REACT_APP_SOLID_ACCEPTED_TERMS = /trompa/action/solidloginredirect
```
#### REACT_APP_LOGOUT
POST service that performs a backend logout of the user. Default value is 
`/trompa/action/logout`

#### REACT_APP_POST_METHODS_PREFIX
prefix (if needed) for the 12 POST methods implemented in the pilot. If no prefix is needed, set the variable to 'false' (`REACT_APP_POST_METHODS_PREFIX = false`).

#### HTTPS, SSL_CRT_FILE AND SSL_KEY_FILE
Use these variables to run the front end in HTTPS mode. You will need to generate self-signed certificates.

## Integration with custom back-end
This pilot can be integrated with any customized back-end. Besides the authentication methods, following POST services must be provided by the server (to see the response of the services, please take a look at `src/utils/server/testing_environment.js`):

### getmusicFolders
This method returns the available campaigns. The form-data is:
```
contains: <string>. Expression to match the campaign name. 
page: <integer>. Page number based on the pagination.
completed: <boolean>. Include completed campaigns in the search.
blocked: <boolean>. Include blocked campaigns in the search.
```
### updateuser
This method updates the user information. The form-data is:
```
lang: <string>
motherLanguage: <string>
birthPlace: <string>
otherLanguages: <string>
researchData: <boolean>
allowContact: <boolean>
sendMail: <boolean>
username: <string>
```
### getuser
This method returns the logged user information. The form-data is:
```
type: <'full','stats','null'>.
//'full' returns all the user settings.
//'stats' returns the stats related to the user (i.e. score and completed campaigns).
//'null' returns the basic user data: name, username, id and language.
```
### getSongs
This method returns all the pending songs of a specific campaign with id = folderId. The form-data is:
```
mfid: <integer>. Campaign ID.
```
### insertAnnotation
This method inserts a new annotation. The form-data is:
```
songId: <integer>
folderId: <integer>
level: <integer>
freeMoodValue: <string>
valenceValue: <integer>
valenceComment: <string>
arousalValue: <integer>
arousalComment: <string>
moodValue: <string>
moodComment: <string>
favSong: <boolean>
knownSong: <boolean>
annotationTime: <integer>
```

### getCommunityStats
This method returns the stats of the community. The response of the method is an object of the form:
### getSongList
This method returns the list of songs according to the filter parameters. The form-data is:
```
type: <one of 'recommended','annotated','liked'>
mood: <one of the 11 tags used in the pilot>
quadrant: [<valence value>,<arousal value>]
```
### getNews
This method returns an array of news created in the backend. No form-data is needed.
### getRanking
This method is used to get the ranking information for a defined range of dates. The form-data of this POST is:
```
start: <MM/DD/YYYY> or null
end: <MM/DD/YYYY> or null
```
### analytics
This method is used to store user clicks in the different sections of the pilot. The form-data of this POST is:
```
<action>: <value>
```
Currently, analytics only implements the `click` action, with the following values:
* `help-btn`: user clicks on help button.
* `Folder-<folderId>`: user clicks specific campaign with id _folderId_.
* `ranking-list`: user access general ranking section. 
* keys of the Menu items, defined in `src/utils/menu.js`.


## Integration with the CE-API
In the `backend-tools/` folder, there is an example in PHP of how to import the annotations generated by this tool to the CE.
