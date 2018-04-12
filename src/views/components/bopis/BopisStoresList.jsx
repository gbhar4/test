/** @module BopisStoreList
 *
 * @author Ben≤
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {BopisStoreListItem} from './BopisStoreListItem.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {BOPIS_ITEM_AVAILABILITY} from 'reduxStore/storeReducersAndActions/stores/stores';
import {BopisSearchResultsSummary} from './BopisSearchResultsSummary.jsx';

export class BopisStoresList extends React.Component {
  static propTypes = {
    /** flags if we are in mobile */
    isMobile: PropTypes.bool.isRequired,
    /** Array of stores to display */
    storesList: PropTypes.arrayOf(BopisStoreListItem.propTypes.store).isRequired,

    /**
     * Function to call when a store is selected. The called function will
     * receive one parameter, the id of the clicked store.
     */
    onStoreSelect: PropTypes.func.isRequired,
    /** flags if to show the checkbox for showing only stores with avialability */
    isShowFilterCheckbox: PropTypes.bool,
    /** flags if search was in stores already in cart */
    isResultOfSearchingInCartStores: PropTypes.bool,

    /** We need to differentiate if Bopis Modal is open from cart or other place to change select item button's message (DT-27100) */
    isShoppingBag: PropTypes.bool,

    /** Function to call when the Cancel button is clicked */
    onCancel: PropTypes.func
  }

  constructor (props) {
    super(props);

    this.state = {isOnlyShowAvailable: false};

    this.handleShowAvailableChange = (event) => { this.setState({isOnlyShowAvailable: !this.state.isOnlyShowAvailable}); };
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }

  handleCancelClick () {
    let {onCancel} = this.props;
    onCancel && onCancel();
  }

  render () {
    let {isShoppingBag, storesList, onStoreSelect, isShowFilterCheckbox, isResultOfSearchingInCartStores} = this.props;
    let {isOnlyShowAvailable} = this.state;

    let storesWithAvailability = storesList.filter((store) => store.productAvailability.status !== BOPIS_ITEM_AVAILABILITY.UNAVAILABLE);
    let filteredStoresList = isOnlyShowAvailable ? storesWithAvailability : storesList;

    return (
      <div className="stores-info">
        <BopisSearchResultsSummary storesList={storesList} numStoresWithAvailability={storesWithAvailability.length}
          isResultOfSearchingInCartStores={isResultOfSearchingInCartStores} onCancel={this.handleCancelClick} />
        {!isResultOfSearchingInCartStores && isShowFilterCheckbox && <LabeledCheckbox className="store-availability-checkbox" title="Only show available stores" input={{value: this.state.isOnlyShowAvailable, onChange: this.handleShowAvailableChange}} />}
        {(!isResultOfSearchingInCartStores || storesWithAvailability.length > 0) && (
          filteredStoresList.map((store) =>
            <BopisStoreListItem
              isShoppingBag={isShoppingBag}
              key={store.basicInfo.id}
              store={store}
              onStoreSelect={onStoreSelect}
              isAddToBagAvailable={store.productAvailability.status === BOPIS_ITEM_AVAILABILITY.AVAILABLE ||
                                   store.productAvailability.status === BOPIS_ITEM_AVAILABILITY.LIMITED}
              defaultStoreName={this.props.defaultStoreName}/>
          )
        )}
      </div>
    );
  }
}
