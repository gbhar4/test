/**
 * @module StoreLocatorList
 * TODO
 *
 * @author damian <drossi@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {StoreLocatorListItem} from './StoreLocatorListItem.jsx';

export class StoreLocatorList extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,
    /** Indicates if "set as default store" feature is enabled or not */
    isEnableSetAsDefault: PropTypes.bool,

    /** Array of stores to display */
    storesList: PropTypes.arrayOf(StoreLocatorListItem.propTypes.store).isRequired,
    /** flags if we are in mobile */
    isMobile: PropTypes.bool.isRequired,
    /** id of store to show as selected */
    selectedStoreId: PropTypes.string,
    /** Function to call to set a store as the default one. */
    onSetFavoriteStore: PropTypes.func.isRequired,
    /**
     * Function to call when a store is clicked. The called function will
     * receive one parameter, the id of the clicked store.
     */
    onStoreClick: PropTypes.func.isRequired,

    /** The Id of the users favorit store */
    favoriteStoreId: PropTypes.string
  }

  render () {
    let {storesList, isGuest, isMobile, selectedStoreId, onStoreClick, onSetFavoriteStore, favoriteStoreId, isEnableSetAsDefault} = this.props;

    if (storesList.length === 0) {
      return null;
    }

    return (
      <div className="stores-info">
        {storesList.map((store) => {
          return (
            <StoreLocatorListItem key={store.basicInfo.id} store={store} isMobile={isMobile}
              isGuest={isGuest}
              isEnableSetAsDefault={isEnableSetAsDefault}
              isSelected={store.basicInfo.id === selectedStoreId}
              onClick={onStoreClick} onSetAsFavorite={onSetFavoriteStore} isFavoriteStore={store.basicInfo.id === favoriteStoreId}
            />
          );
        })}
      </div>
    );
  }
}
