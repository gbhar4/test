/** @module WishlistHeaderContainer
 * @author Carla Crandall <carla.crandall@sapientrazorfish.com>
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {WishlistHeader} from './WishlistHeader.jsx'
import {favoritesStoreView} from 'reduxStore/storeViews/favoritesStoreView';

function mapStateToProps(state, ownProps, storeOperators) {
    return {
        itemDeletedId: favoritesStoreView.getLastDeletedItemId(state)
    };
}

let WishlistHeaderContainer = connectPlusStoreOperators(mapStateToProps)(WishlistHeader);

export {WishlistHeaderContainer};
