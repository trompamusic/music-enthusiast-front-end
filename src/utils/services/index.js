import * as test from './testing_environment.js';
import * as services from './services.js';
import { isLocalEnv } from '../constants';

export const userAuthentication = isLocalEnv? test.userAuthentication : services.userAuthentication;
export const authenticatedUserLogin = isLocalEnv? test.authenticatedUserLogin : services.authenticatedUserLogin;
export const logOut = isLocalEnv? test.logOut : services.logOut;
export const servercall = isLocalEnv? test.servercall : services.servercall;
export const analytics = isLocalEnv? test.analytics : services.analytics;

export default isLocalEnv? { ...test } : { ...services };