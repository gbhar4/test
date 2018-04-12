// IE polyfill for ES6
import 'babel-polyfill';

import React from 'react';
import Modal from 'react-modal';
import {fullPageRender} from '../fullPageRender.js';

import {HeaderGlobalWithNavigation} from 'views/components/globalElements/HeaderGlobalWithNavigation.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {trackingInitialization} from 'util/analytics/trackingInitialization';
import {LEGACY_PAGE_ID} from 'routing/routes/pages';

require('./_legacy-overrides.scss');

let header = document.getElementById('tcp-global-header');
let footer = document.getElementById('tcp-global-footer');

fullPageRender(<HeaderGlobalWithNavigation />, header, LEGACY_PAGE_ID);
fullPageRender(<FooterGlobalContainer />, footer, LEGACY_PAGE_ID, {notInitializeStore: true});

Modal.setAppElement(document.getElementById('tcp-global-header'));
trackingInitialization();
