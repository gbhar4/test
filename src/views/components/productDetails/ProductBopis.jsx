/** @module ProductBopis
 * @summary Shows the BOPIS CTA in PDP
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {BopisModalContainer} from 'views/components/bopis/BopisModalContainer';
import {
  PRODUCT_INFO_PROP_TYPE_SHAPE,
  MISC_INFO_PROP_TYPES_SHAPE
} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {getMapSliceForColor} from 'util/viewUtil/productsCommonUtils';

if (DESKTOP) { // eslint-disable-line
  require('views/components/productDetails/_d.custom-information.scss');
} else {
  require('views/components/productDetails/_m.custom-information.scss');
}

export class ProductBopis extends React.Component {

  static propTypes = {
    /** When flase, flags that BOPIS is globaly disabled */
    isBopisEnabled: PropTypes.bool,

    /**
     * Information regarding the product at the swatch/color level.
     */
    productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,

    /** Product availability and pickup information */
    miscInfo: MISC_INFO_PROP_TYPES_SHAPE.isRequired,

    /** User's preferred store information */
    preferredStore: PropTypes.shape({
      basicInfo: PropTypes.shape({
        /** store id identifier */
        id: PropTypes.string.isRequired,
        /** store Name */
        storeName: PropTypes.string.isRequired
      }).isRequired
    }),

    /**
     * Item values selected for the product, to use in the BOPIS modal if it
     * gets opened.
     */
    itemValues: PropTypes.shape({
      color: PropTypes.string.isRequired,
      fit: PropTypes.string,
      size: PropTypes.string,
      quantity: PropTypes.number
    }),

    /**
     * if the user selected a not allowed fit we need to show the modal
     * instead of adding to bag even if the user has a favorite store selected
     */
    disabledFits: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,

    /**
     * callback to trigger when the user has a preferred store setup
     * and the user selected all option (fit, size, color)
     * to add the item directly to the preferred store without opening the modal
     * accepts productInfo, itemValues (selection on the form) and preferred store id
     * returns product info on successful add, null if there was no inventory on the preferred store
     **/
    onAddItemToPreferredStoreCart: PropTypes.func.isRequired,

    /**
     * callback to trigger on success of onAddItemToPreferredStoreCart
     * (to show the notification)
     **/
    onAddItemToPreferredStoreCartSuccess: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);
    this.state = {
      isBopisModalEnabled: false,
      isPreferredStoreError: false // indicates there was an error adding the product automatically, hence showing the modal (the modal needs to show an error message in this case)
    };
    this.handleBopisOpenClick = this.handleBopisOpenClick.bind(this);
    this.handleBopisCloseClick = () => { this.setState({isBopisModalEnabled: false}); };
  }

  handleBopisOpenClick () {
    let {preferredStore, disabledFits, itemValues: { fit, color, size, quantity }} = this.props;

    // not checking fit: a) it's alwayes preselected, b) not sure the product has fits available
    if (preferredStore && color && size && quantity && disabledFits.indexOf(fit) === -1) {
      this.props.onAddItemToPreferredStoreCart(this.props.productInfo, this.props.itemValues, preferredStore.basicInfo.id).then((res) => {
        if (res) {
          return this.props.onAddItemToPreferredStoreCartSuccess(res);
        } else {
          // no inventory on the preferred store - open modal
          this.setState({
            isBopisModalEnabled: true,
            isPreferredStoreError: true
          });
        }
      }).catch(() => this.setState({
        isBopisModalEnabled: true,
        isPreferredStoreError: true
      }));
    } else {
      // options not selected - open modal
      this.setState({
        isBopisModalEnabled: true,
        isPreferredStoreError: false
      });
    }
  }

  render () {
    let {isBopisEnabled, preferredStore, productInfo, itemValues} = this.props;
    if (!isBopisEnabled) return null;

    let {isPreferredStoreError} = this.state;
    let colorSlice = getMapSliceForColor(productInfo.colorFitsSizesMap, itemValues.color);
    let isBopisEligible = colorSlice && colorSlice.miscInfo && colorSlice.miscInfo.isBopisEligible;

    return (
      <div className="bopis-section-container">
        <h2 className="title-bopis-section">Buy Online - Pick Up In Store</h2>
        {!isBopisEligible
          ? <h4 className="subtitle-bopis-section">Unavailable for this item.</h4>
          : preferredStore
            ? (
              <div className="change-store-container">
                <h4 className="subtitle-bopis-section store-name">{preferredStore.basicInfo.storeName}</h4>
                <HyperLink destination={PAGES.storeLocator} className="button-change-store">Change store</HyperLink>
              </div>
            ) : (
              <div className="subtitle-bopis-unavailable">
                <h4 className="subtitle-bopis-section">Don't see your size/color?</h4>
                <br />
                <h4 className="subtitle-bopis-section">Check availability at stores near you</h4>
              </div>
            )
        }
        {isBopisEligible && <ContentSlot contentSlotName="pdp_bopis_promo" className="product-details-bopis-promo" />}
        <button className={cssClassName('button-find-in-store', {' disabled': !isBopisEligible})}
          disabled={!isBopisEligible} onClick={this.handleBopisOpenClick}>
          {preferredStore ? 'Buy & Pick up' : 'Find in store'}
          </button>

        {this.state.isBopisModalEnabled && <BopisModalContainer onCloseClick={this.handleBopisCloseClick}
          isShowAddItemSuccessNotification initialValues={itemValues} productInfo={productInfo}
          isPreferredStoreError={isPreferredStoreError} />}
      </div>
    );
  }
}
