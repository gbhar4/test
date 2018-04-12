/**
 * @module HeaderGlobalTopBar
 * @author Agu
 * Top bar piece for desktop (find in store, plus drawer buttons)
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {DesktopAccountHeaderLinksContainer} from 'views/components/globalElements/header/DesktopAccountHeaderLinksContainer.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {FindStoreLink} from './header/FindStoreLink.jsx';
import {DesktopAccountDrawersContainer} from 'views/components/globalElements/header/DesktopAccountDrawersContainer.js';
import {SkipToContentButton} from 'views/components/common/SkipToContentButton.jsx';

class HeaderGlobalTopBar extends React.Component {
  static propTypes = {
    defaultStoreName: PropTypes.string,

    /** selector to the element that needs to retrieve focus when skit to content button is clicked on */
    mainContentSelector: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className="header-global-messages viewport-container">
        <SkipToContentButton contentSelector={this.props.mainContentSelector} />
        <FindStoreLink defaultStoreName={this.props.defaultStoreName} />
        <ContentSlot contentSlotName="global_header_banner_within_header" className="header-global-message" />
        <DesktopAccountHeaderLinksContainer />
        <DesktopAccountDrawersContainer />
      </div>
    );
  }
}

export {HeaderGlobalTopBar};
