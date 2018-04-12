/** @module HeaderGlobalBannerDesktop
 *
 * @author Ben
 */

import React from 'react';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

export class HeaderGlobalBannerDesktop extends React.Component {

  render () {
    return (
      <ContentSlot contentSlotName="global_header_banner_above_header" className="header-global-banner" />
    );
  }

}
