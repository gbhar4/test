import React from 'react';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {Rewards} from 'views/components/rewards/Rewards.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {CONTENT_PAGE_CUSTOM_ESPOT_NAME} from 'reduxStore/storeReducersAndActions/general/general';

/**
 * @author Gabriel Gomez
 * @summary This Page is intended to capture a query parameter and pass it down to the 'contentSlotList' in order to load
 * it as an e-spot on demand. Routing should provide us with all information and infra require to load required e-spots.
 * The component will response to: /us/content/<ESPOT>
 */

export class ContentPage extends React.Component {
  render () {
    let {isMobile, rewardsOverlay} = this.props;

    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />
        <main className="main-section-container">
          <ContentSlot contentSlotName={CONTENT_PAGE_CUSTOM_ESPOT_NAME}/>
        </main>
        <FooterGlobalContainer isMobile={isMobile}/>
        {rewardsOverlay && <Rewards {...this.props}/>}
      </div>
    );
  }
}
