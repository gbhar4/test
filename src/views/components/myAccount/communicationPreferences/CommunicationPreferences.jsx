/**
 * @module CommunicationPreferences
 * Shows the different views for the user to see the list and details of his
 * orders in My Account.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {Route} from 'views/components/common/routing/Route.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {BreadCrumbs} from 'views/components/common/routing/BreadCrumbs.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.communication-preferences-section.scss');
} else {
  require('./_m.communication-preferences-section.scss');
}

class CommunicationPreferences extends React.Component {
  render () {
    let {iframeUrl, className} = this.props;
    let containerClassName = cssClassName('comm-prefs ', className);

    return (
      <div className={containerClassName}>
        <Route component={BreadCrumbs} componentProps={{sections: MY_ACCOUNT_SECTIONS}} />

        <iframe src={iframeUrl}></iframe>
      </div>
    );
  }
}

export {CommunicationPreferences};
