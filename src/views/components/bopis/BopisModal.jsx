/** @module BopisModal
 *
 * @author ?
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {BopisInventoryStoresSearchForm, DISTANCES_MAP_PROP_TYPE} from './BopisInventoryStoresSearchForm.jsx';
import {BopisHeader} from './BopisHeader.jsx';
import {PRODUCT_INFO_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {getMapSliceForColor, getIconImageForColor} from 'util/viewUtil/productsCommonUtils';
import {getPrices} from 'util/viewUtil/productsCommonUtils.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.bopis.scss');
} else {
  require('./_m.bopis.scss');
}

export class BopisModal extends React.Component {
  static propTypes = {
    /** the maximum number of different stores used for BOPIS in a single shopping cart. must be at least 1 */
    maxAllowedStoresInCart: PropTypes.number.isRequired,
    /** The map of distances options to select the radius of search */
    distancesMap: DISTANCES_MAP_PROP_TYPE.isRequired,
    /* the list of stores currently in the cart */
    cartBopisStoresList: PropTypes.arrayOf(PropTypes.shape({
      basicInfo: PropTypes.shape({
        storeName: PropTypes.string.isRequired
      }).isRequired
    })).isRequired,
    /** seed values for the form */
    initialValues: PropTypes.shape({
      /** user's preselected color id from parent instance */
      color: PropTypes.string,
      /** user's preselected fit id from parent instance */
      fit: PropTypes.string,
      /** user's preselected size id from parent instance */
      size: PropTypes.string,
      /** user's preselected quantity from parent instance */
      quantity: PropTypes.number
    }).isRequired,

    productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,

    /** an optional identifier to be passed to onAddItemToCart */
    requestorKey: PropTypes.string,

    /** callback for closing this modal */
    onCloseClick: PropTypes.func.isRequired,
    /**
     * Callback to run on component mount (usually to populate redux store information consumened by this component).
     * Should return a promise
     * */
    onMount: PropTypes.func.isRequired,
    /** submit method for BopisCartStoresInventoryForm */
    onSearchInCurrentCartStoresSubmit: PropTypes.func.isRequired,
    /** submit method for BopisInventoryStoresSearchForm */
    onSearchAreaStoresSubmit: PropTypes.func.isRequired,
    /**
     * Callback for adding an item to cart for pickup in the selected store.
     * Accepts: formData, itemId; where formData is an object with the keys: storeId, skuId (of the selected color/fit/size combination), quantity
     * and itemId is an optional identifier of the item one wishes to add to the cart (see the prop requestorKey).
     */
    onAddItemToCart: PropTypes.func.isRequired,
    /**
     * Function to call when the item has been successfully added to, or updated
     * in, the cart.
     */
    onAddItemToCartSuccess: PropTypes.func,

    /** We need to differentiate if Bopis Modal is open from cart or other place to change select item button's message (DT-27100) */
    isShoppingBag: PropTypes.bool,

    /** indicates the 'extended' sizes not available for bopis notification needs to show
     * (only when user attempted to select it)
     */
    isShowExtendedSizesNotification: PropTypes.bool.isRequired,

    /**
     * indicates the modal is shown because of an error trying to add to the preferred store
     * (required only in PDP)
     */
    isPreferredStoreError: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.state = {isLoading: true, formValues: props.initialValues};

    this.skuId = null;
    this.quantity = null;
    this.initialFormValues = {distance: props.distancesMap[0].id, ...props.initialValues};

    this.handleSearchAreaStoresSubmit = this.handleSearchAreaStoresSubmit.bind(this);
    this.handleSearchInCurrentCartStoresSubmit = this.handleSearchInCurrentCartStoresSubmit.bind(this);
    this.handleAddItemToCart = this.handleAddItemToCart.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  componentDidMount () {
    this.props.onMount()
    .then(() => this.setState({isLoading: false}));
    // .catch(() => this.setState({isLoading: false}));
  }

  handleFormChange (formData) {
    this.setState({formValues: formData});
  }

  handleSearchAreaStoresSubmit (skuId, quantity, distance, locationPromise) {
    this.skuId = skuId;
    this.quantity = quantity;
    return this.props.onSearchAreaStoresSubmit(skuId, quantity, distance, locationPromise);
  }

  handleSearchInCurrentCartStoresSubmit (skuId, quantity) {
    this.skuId = skuId;
    this.quantity = quantity;
    return this.props.onSearchInCurrentCartStoresSubmit(skuId, quantity);
  }

  handleAddItemToCart (formData) {
    let {productInfo, onCloseClick, onAddItemToCartSuccess, requestorKey} = this.props;
    return this.props.onAddItemToCart(formData, requestorKey).then((res) => {
      onCloseClick();
      if (!onAddItemToCartSuccess) {
        return;
      }
      let addedProductInfo = {
        isGiftCard: false,
        productName: productInfo.name,
        skuInfo: {
          skuId: formData.skuId,
          imageUrl: getIconImageForColor(productInfo, formData.color),
          color: getMapSliceForColor(productInfo.colorFitsSizesMap, formData.color).color,
          fit: formData.fit,
          size: formData.size
        },
        quantity: formData.quantity
      };
      onAddItemToCartSuccess(addedProductInfo);
      return addedProductInfo;
    });
  }

  renderNormal () {
    let {isPreferredStoreError, isShowExtendedSizesNotification, isShoppingBag, cartBopisStoresList, maxAllowedStoresInCart, onCloseClick, productInfo,
      productInfo: {name, colorFitsSizesMap}, distancesMap} = this.props;

    let isSearchOnlyInCartStores = maxAllowedStoresInCart <= cartBopisStoresList.length;
    let handleSubmit = isSearchOnlyInCartStores
      ? this.handleSearchInCurrentCartStoresSubmit
      : this.handleSearchAreaStoresSubmit;

    let {color, fit, size} = this.state.formValues;
    let prices = getPrices(productInfo, color, fit, size);

    return (
      <div className="bopis-modal-content">
        <ModalHeaderDisplayContainer onCloseClick={onCloseClick}>
          <BopisHeader cartBopisStoresList={cartBopisStoresList} maxAllowedStoresInCart={maxAllowedStoresInCart} />
        </ModalHeaderDisplayContainer>
        <BopisInventoryStoresSearchForm isShoppingBag={isShoppingBag} initialValues={this.initialFormValues}
          listPrice={prices.listPrice} offerPrice={prices.offerPrice} name={name} imagePath={getIconImageForColor(productInfo, color)}
          onChange={this.handleFormChange} distancesMap={distancesMap} isShowExtendedSizesNotification={isShowExtendedSizesNotification}
          colorFitsSizesMap={colorFitsSizesMap} onSubmit={handleSubmit} onAddItemToCart={this.handleAddItemToCart}
          isSearchOnlyInCartStores={isSearchOnlyInCartStores} onCloseClick={onCloseClick}
          isPreferredStoreError={isPreferredStoreError} />
      </div>
    );
  }

  render () {
    return (
      <Modal className="overlay-container overlay-bopis-content" overlayClassName="react-overlay" contentLabel="BOPIS" isPopup={false} preventEventBubbling isOpen>
        {this.state.isLoading ? <Spinner /> : this.renderNormal()}
      </Modal>
    );
  }
}
