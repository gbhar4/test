/** @module FavoriteButton
 * Show the wishlist CTA for a certain product, including the number of times
 * the product has been marked as a favorite by users and the ability for the
 * user to add the product to a favorites list.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';

export class FavoriteButton extends React.Component {
  static propTypes = {
    /** Id of the product for which this button is being rendered. */
    generalProductId: PropTypes.string.isRequired,
    /** Id of the product and color combination for which this button is being rendered. */
    colorProductId: PropTypes.string.isRequired,
    /** Id of the selected SKU, if a size has been selected in the form */
    skuId: PropTypes.string,

    /** Number of items to add to favorites */
    quantity: PropTypes.number.isRequired,

    /** Flags if the product is included in a favorites list. */
    isProductInFavorites: PropTypes.bool.isRequired,

    /** flags to render the favoritedCount */
    isShowFavoriteCount: PropTypes.bool,
    /** Number of times the product has been marked as favorites by all users (negative values are not rendered).
     * required if the prop isShowFavoriteCount is true
     */
    favoritedCount: PropTypes.number.isRequired,

    /** Function to call to add an item to a wishlist; accepts: generalProductId, colorProductId, and optional skuId, quantity */
    onAddItemToFavorites: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      error: null,
      isAddingProductInFavorites: false
    };

    this.handleAddItemToFavorites = this.handleAddItemToFavorites.bind(this);
    this.setError = getSetErrorInStateMethod(this);
  }

  handleAddItemToFavorites () {
    let {generalProductId, colorProductId, skuId, quantity, onAddItemToFavorites} = this.props;

    this.setState({isAddingProductInFavorites: true});   
    onAddItemToFavorites(generalProductId, colorProductId, skuId, quantity)
    .then(() => {
      this.setState({isAddingProductInFavorites: false});
      this.setError();
    }).catch((err) => {
      this.setState({isAddingProductInFavorites: false});
      this.setError(err);
    });
  }

  render () {
    let {isShowFavoriteCount, favoritedCount, isProductInFavorites, isActiveHoverMessage} = this.props;

    let {error, isAddingProductInFavorites} = this.state;

    let addToWishlistClass = cssClassName('button-wishlist ', {'added-to-wishlist': isProductInFavorites});

    return (
      <div className="wishlist-icon-container">
        <button className={addToWishlistClass} onClick={this.handleAddItemToFavorites} disabled={isProductInFavorites || isAddingProductInFavorites}>Favorites</button>
        {isShowFavoriteCount && favoritedCount >= 0 && <span className="wishlist-qty-information">{favoritedCount}</span>}
        {isActiveHoverMessage && <div className="favorite-message">Add to Favorites</div>}
        {error && <ErrorMessage error={error} />}
      </div>
    );
  }
}
