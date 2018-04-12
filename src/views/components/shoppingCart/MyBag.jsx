/**
 * @module MyBag
 * @author Miguel Alvarez Igarzábal
 * @author Florencia Acosta
 * Shows the empty or non-empty shopping cart component, depending on the
 * component status.
 *
 * Style (className) Elements description/enumeration:
 *  -
 *
 * Uses:
 *  <MyBagEmptyContainer />
 *  <MyBagNonEmpty />
 *
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {MyBagEmptyContainer} from './MyBagEmptyContainer.js';
import {MyBagNonEmpty} from './MyBagNonEmpty.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';
import { FooterGlobalContainer } from 'views/components/globalElements/FooterGlobalContainer.js';
if (DESKTOP) { // eslint-disable-line
  require('./_d.my-bag.scss');
} else {
  require('./_m.my-bag.scss');
}

export class MyBag extends React.Component {
  static propTypes = {
    /** Number of items in the cart. */
    itemsCount: PropTypes.number.isRequired,

    /** Whether to render for mobile. */
    isMobile: PropTypes.bool.isRequired,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    /** Flag to know if content should be into a modal */
    isModal: PropTypes.bool,

    /** Whether the secetion is Plcss. */
    isPlcc: PropTypes.bool
  }

  render () {
    let {isMobile, isRewardsEnabled, isGuest, isRemembered, itemsCount, isLoading, isAirMilesEnabled, isPocTestActive} = this.props;

    if (isLoading) { return <Spinner />; }

    if (itemsCount === 0) {
      return <MyBagEmptyContainer isMobile={isMobile} isCondense />;
    }

    return (
      <div>
        <MyBagNonEmpty isMobile={isMobile} isGuest={isGuest} isRemembered={isRemembered} 
                       isRewardsEnabled={isRewardsEnabled} isAirMilesEnabled={isAirMilesEnabled} />
        {isPocTestActive && <FooterGlobalContainer />}
      </div>
    );
  }
}
