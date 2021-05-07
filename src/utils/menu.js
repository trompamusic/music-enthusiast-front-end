/*
  menu.js: array with the object list that links components with route paths. All new components that must be linked to
  an specific path must be added here. Additional flags allow to manage item visibility in the menu nav bars.
    inMenu: Component is visible in navbar menu or not.
    public: Component is visible even when there is no logged user.
*/
import {
  Home,
  About,
  News,
  // FolderManagement,
  Practice,
  Annotation,
  MusicProfile,
  UserManagement,
  FolderEdit,
  FolderStats,
  Ranking,
  NotFound } from "../components";

export const mainMenu = [
  {
    key: 'FolderEdition',
    link: '/trompa/rc/editfolder/fi=:folderId',
    module: FolderEdit,
  },
  {
    key: 'FolderStats',
    link: '/trompa/rc/folderstats/fi=:folderId',
    module: FolderStats,
  },
  {
    key: 'News',
    link: '/trompa/rc/news',
    module: News,
    inMenu: true,
    public: true,
  },
  {
    key: 'About_us',
    link: '/trompa/rc/about',
    module: About,
    inMenu: true,
    public: true,
  },
  {
    key: 'Settings',
    link: '/trompa/rc/settings',
    module: UserManagement,
    inUserMenu: true,
  },
  // {
  //   key: 'My_Folders',
  //   link: '/trompa/rc/managefolders',
  //   module: FolderManagement,
  //   inMenu: true,
  // },
  {
    key: 'My_musical_profile',
    link: '/trompa/rc/musicprofile',
    module: MusicProfile,
    inMenu: true,
  },
  {
    key: 'Ranking',
    link: '/trompa/rc/ranking',
    module: Ranking,
  },
  {
    key: 'Annotate',
    link: '/trompa/rc/annotate/fi=:folderId',
    module: Annotation,
  },
  {
    key: 'Annotate',
    link: '/trompa/rc/annotate',
    module: Practice,
    inMenu: true,
  },
  {
    key: 'Not_found_page',
    link: '/trompa/rc/notfound',
    module: NotFound,
  },
  {
    key: 'Home',
    link: ['/trompa/rc','/trompa', '/'],
    module: Home,
    public: true,
    inMenu: true,
  },
];