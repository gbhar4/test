/**
 * @module MyAccountHeaderContainer
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 *
 * Exports the container component for the MyAccountHeaderContainer component,
 * connecting state to it's props.
 */

import {MyAccountHeaderConnect} from 'views/components/myAccount/header/MyAccountHeaderConnect.js';
import {MyAccountHeader} from './MyAccountHeader.jsx';

let MyAccountHeaderContainer = MyAccountHeaderConnect(MyAccountHeader);

export {MyAccountHeaderContainer};
