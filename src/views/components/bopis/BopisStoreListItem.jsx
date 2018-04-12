/** @module BopisStoreListItem
 * Show the summary of a store, including name, address, phone, type.
 *
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {
  StoreTitle,
  StoreAddress,
  StorePhone,
  OpenUntilNextTwoDays,
  DistanceFromMe
} from 'views/components/store/detail/StoreSummaryComponents.jsx';
import {BOPIS_ITEM_AVAILABILITY} from 'reduxStore/storeReducersAndActions/stores/stores';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {STORE_SUMMARY_PROP_TYPES} from 'views/components/common/propTypes/storesPropTypes';

const ITEM_AVAILABILITY_MESSAGES = {
  [BOPIS_ITEM_AVAILABILITY.AVAILABLE]: 'AVAILABLE',
  [BOPIS_ITEM_AVAILABILITY.LIMITED]: 'LIMITED AVAILABILITY',
  [BOPIS_ITEM_AVAILABILITY.UNAVAILABLE]: 'UNAVAILABLE'
};

export class BopisStoreListItem extends React.Component {
  static propTypes = {
    /** The whole information of the store. */
    store: PropTypes.shape({
      ...STORE_SUMMARY_PROP_TYPES,
      /** the availability status of the searched for cart item in this store */

      productAvailability: PropTypes.shape({
        status: PropTypes.oneOf(Object.keys(BOPIS_ITEM_AVAILABILITY).map((key) => BOPIS_ITEM_AVAILABILITY[key])).isRequired
      }).isRequired
    }).isRequired,

    /** flag which describes wheter the item add to bag will be disabled or not */
    isAddToBagAvailable: PropTypes.bool.isRequired,
    /**
     * Function to call when a store is selected. The called function will
     * receive one parameter, the id of the clicked store.
     */
    onStoreSelect: PropTypes.func.isRequired,

    /** We need to differentiate if Bopis Modal is open from cart or other place to change select item button's message (DT-27100) */
    isShoppingBag: PropTypes.bool,

    /** specifies current store to match store Name */
    defaultStoreName: PropTypes.string
  }

  state = {
    error: null
  }

  constructor (props) {
    super(props);
    this.setError = getSetErrorInStateMethod(this);
    this.handleStoreSelect = this.handleStoreSelect.bind(this);
  }

  handleStoreSelect () {
    this.setError();          // clear current error (if any) Note that we do not do this in the then() callback, as this component may be dismounted by then
    this.props.onStoreSelect(this.props.store.basicInfo.id)
    .catch((err) => this.setError(err));
  }

  render () {
    let {isShoppingBag, defaultStoreName, store: {basicInfo, distance, hours, productAvailability: {status}}, isAddToBagAvailable} = this.props;
    let {error} = this.state;
    let className = cssClassName('bopis-store-item-info ', {'selected ': defaultStoreName === basicInfo.storeName});

    // FIXME: should we relay on media query to adjust CSS on mobile or we want an explicit CSS based ona isMobile prop?
    return (
      <div className={className} itemScope itemType="http://schema.org/ClothingStore">
        {error && <ErrorMessage error={error} />}

        <StoreTitle basicInfo={basicInfo} />
        <div className="content-direction">
          <DistanceFromMe distance={distance} />
          <StoreAddress basicInfo={basicInfo} />
        </div>
        <div className="content-store-detail">
          <StorePhone basicInfo={basicInfo} />
          <OpenUntilNextTwoDays hours={hours} />
        </div>
        <span className="bopis-availability">{ITEM_AVAILABILITY_MESSAGES[status]}</span>
        <button className="select-store-button" type="button" onClick={this.handleStoreSelect} disabled={!isAddToBagAvailable}>{isShoppingBag ? 'Select store' : 'Add to Bag'}</button>
      </div>
    );
  }

}
