/** @module MiniBagDrawer
 * @summary a presentational component for rendering a mini-cart
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {MiniBagDrawerEmpty} from './MiniBagDrawerEmpty.jsx';
import {MiniBagDrawerNonEmptyContainer} from './MiniBagDrawerNonEmptyContainer.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.my-bag-overlay.scss');
}

export class MiniBagDrawer extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    /** the number of items in the cart */
    itemsCount: PropTypes.number.isRequired,

    /**
     * A callback to change the displayed form in this drawer.
     * Accepts a single prop which is the ID of the form (see LOGIN_FORM_TYPES)
     */
    changeForm: PropTypes.func.isRequired,
    /**
     * A callback to change the displayed form.
     * Accepts a single prop which is the ID of the drawer (see DRAWER_IDS)
     */
    changeDrawer: PropTypes.func.isRequired,

    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool.isRequired
  }

  render () {
    let {isGuest, itemsCount, isRemembered, changeForm, changeDrawer, isRewardsEnabled} = this.props;

    if (itemsCount > 0) {
      return <MiniBagDrawerNonEmptyContainer isRewardsEnabled={isRewardsEnabled} />;
    } else {
      return <MiniBagDrawerEmpty isGuest={isGuest} isRemembered={isRemembered} changeForm={changeForm} changeDrawer={changeDrawer} isRewardsEnabled={isRewardsEnabled} />;
    }
  }

}
