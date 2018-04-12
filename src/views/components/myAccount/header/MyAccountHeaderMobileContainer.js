/**
 * @module MyAccountHeaderMobileContainer
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 *
 * Exports the container component for the MyAccountHeaderMobileContainer component,
 * connecting state to it's props.
 */

import {MyAccountHeaderConnect} from 'views/components/myAccount/header/MyAccountHeaderConnect.js';
import {MyAccountHeaderMobile} from './MyAccountHeaderMobile.jsx';

let MyAccountHeaderMobileContainer = MyAccountHeaderConnect(MyAccountHeaderMobile);

export {MyAccountHeaderMobileContainer};
