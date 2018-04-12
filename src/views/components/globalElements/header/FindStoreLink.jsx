import React from 'react';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {PropTypes} from 'prop-types';

class FindStoreLink extends React.Component {
  static propTypes = {
    /* the name of the default store for the user (if available) */
    defaultStoreName: PropTypes.string
  }

  render () {
    return (
      <HyperLink destination={PAGES.storeLocator} className="button-find-store">
        <span>{this.props.defaultStoreName || 'Find a Store'}</span>
      </HyperLink>
    );
  }
}

export {FindStoreLink};
