/** @module BopisSearchResultsSummary
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';

export class BopisSearchResultsSummary extends React.Component {
  static propTypes = {
    /** the list of stores searched in */
    storesList: PropTypes.arrayOf(PropTypes.shape({
      basicInfo: PropTypes.shape({
        storeName: PropTypes.string.isRequired
      }).isRequired
    })),
    /** the number of searched stores that the item is available in */
    numStoresWithAvailability: PropTypes.number.isRequired,
    /** flags if search was in stores already in cart */
    isResultOfSearchingInCartStores: PropTypes.bool,
    /** Function to call when the Cancel button is clicked */
    onCancel: PropTypes.func.isRequired
  }

  render () {
    let {storesList, numStoresWithAvailability, isResultOfSearchingInCartStores, onCancel} = this.props;

    let message = null;
    let className = null;
    if (numStoresWithAvailability > 0) {     // if item was found in some store
      if (!isResultOfSearchingInCartStores) {
        message = `Available Today at ${numStoresWithAvailability} Store${numStoresWithAvailability !== 1 ? 's' : ''}`;
        className = 'search-result';
      }
    } else {        // item not found in any store
      if (isResultOfSearchingInCartStores) {
        message = 'Sorry, Your item is not available at ' + storesList[0].basicInfo.storeName;
        for (let i = 1; i < storesList.length; i++) {
          message += ' or ' + storesList[i].basicInfo.storeName;
        }
        message += '.';
        className = 'empty-search-result';
      } else {
        message = 'Available Today at 0 stores';
        className = 'empty-search-result';
      }
    }

    return (
      message && (
        <div className={className}>
          <div className="message-container">{message}</div>
          {isResultOfSearchingInCartStores && numStoresWithAvailability === 0 && (
            <button type="button" onClick={onCancel} className="button-cancel">Cancel</button>
          )}
        </div>
      )
    );
  }
}
