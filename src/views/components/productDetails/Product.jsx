/**
 * @module Product
 * @summary Show product image gallery, social media buttons, basic product
 * details, add to bag form, and BOPIS information and CTAs.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ProductCustomizeForm, COLOR_FIELD_NAME} from './ProductCustomizeForm.jsx';
import {ProductBopisContainer} from './ProductBopisContainer.js';
import {ProductImages} from './ProductImages.jsx';
import {ProductBasicInfo} from 'views/components/productDetails/ProductBasicInfo';
import {ProductPrice} from './ProductPrice.jsx';
import {PRODUCT_INFO_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {getMapSliceForColorProductId, getMapSliceForColor, getPrices, getDefaultFitForColorSlice, getDefaultSizeForProduct} from 'util/viewUtil/productsCommonUtils.js';
import {Spinner} from 'views/components/common/Spinner.jsx';

export class Product extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,

    /** Whether to show the spinner or not */
    isInventoryLoaded: PropTypes.bool,

    /**
     *  Describes a general product, not yet specialized by chosing a color, size, etc.
     *  For example, a product shown in reccomendations, or PDP.
     */
    productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,

    /* The session currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    /** callback for change in the selected color (accepts: colorProductId) and returns a promise */
    onColorChange: PropTypes.func.isRequired,

    /** Id of the product color to show */
    colorProductId: PropTypes.string.isRequired,

    /** Callback for adding an item to bag. Accepts two params: productInfo, formData.
     * The productInfo is like the prop of this object, and form data contains the keys: color, fit, size, quantity.
     */
    onAddItemToBag: PropTypes.func.isRequired,
    /** Callback for acknowledging a successfull adding to bag. Accepts two params: productInfo, formData.
     * The productInfo is like the prop of this object, and form data contains the keys: color, fit, size, quantity.
     */
    onAddItemToBagSuccess: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    let initialAddToBagFormValues = this.getInitialAddToBagFormValues(this.props);

    /**
     * PLEASE NOTE THE DIFFERENCE BETWEEN initialAddToBagFormValues AND addToBagFormValues
     *
     * initialAddToBagFormValues:
     * Used by ProductCustomizeForm
     * We only need to pass the values in once when the inventory has loaded
     *
     * addToBagFormValues:
     * Used by ProductBasicInfo
     * We need to pass the values in every time the fit/size is updated in the form to make sure the FavoriteButton has the correct SKU value (DT-31913)
     */
    this.state = {
      initialAddToBagFormValues: initialAddToBagFormValues,
      addToBagFormValues: initialAddToBagFormValues
    };

    this.handleAddToBagFormChange = this.handleAddToBagFormChange.bind(this);
    this.handleAddItemToBag = (formData) => this.props.onAddItemToBag(this.props.productInfo, formData);
    this.handleImagesColorChange = this.handleImagesColorChange.bind(this);
  }

  /**
   * DT-31913
   * Update addToBagFormValues whenever the ProductCustomizeForm changes to make sure we pass the correct SKU value to ProductBasicInfo/FavoriteButton
   * NOTE: Not great for performance reasons because it triggers re-renders
   */
  handleAddToBagFormChange (formData) {
    this.setState({ addToBagFormValues: formData });
  }

  handleImagesColorChange (colorName) {
    let {onColorChange, productInfo} = this.props;
    return onColorChange(getMapSliceForColor(productInfo.colorFitsSizesMap, colorName).colorProductId);
  }

  getInitialAddToBagFormValues (props) {
    let colorFitsSizesMapEntry = getMapSliceForColorProductId(props.productInfo.colorFitsSizesMap, props.productInfo.generalProductId);
    return {
      color: colorFitsSizesMapEntry.color.name,
      fit: colorFitsSizesMapEntry.hasFits ? getDefaultFitForColorSlice(colorFitsSizesMapEntry).fitName : null,
      size: props.productInfo.isGiftCard
        ? props.productInfo.colorFitsSizesMap[0].fits[0].sizes[0].sizeName      // on gift card we need something selected, otherwise no price would show up
        : getDefaultSizeForProduct(props.productInfo.colorFitsSizesMap),
      quantity: 1
    };
  }

  componentWillReceiveProps (nextProps) {
    // When the inventory gets updated by the API its possible that the initial form values may change. NodeJS always Defaults to first due to not making inventory count
    if (!this.props.isInventoryLoaded && nextProps.isInventoryLoaded) {
      this.setState({ initialAddToBagFormValues: this.getInitialAddToBagFormValues(nextProps) });
    }
  }

  render () {
    let {isMobile, isInventoryLoaded, productInfo, colorProductId, currencySymbol, outfits, onColorChange, onAddItemToBagSuccess} = this.props;
    let {addToBagFormValues, initialAddToBagFormValues} = this.state;
    let {isGiftCard} = productInfo;
    let productCustomizeFormName = this.getProductCustomizeFormName();
    let colorProduct = getMapSliceForColorProductId(productInfo.colorFitsSizesMap, colorProductId);

    let productBasicInfoElem = <ProductBasicInfo badge={colorProduct.miscInfo.badge1} productInfo={productInfo} {...addToBagFormValues}
      isShowFavoriteCount currencySymbol={currencySymbol} isPriceVisible={!isMobile} isRatingsVisible />;

    let prices = getPrices(productInfo, colorProduct.color.name);

    return (
      <div className="product-details-content" itemScope itemType="https://schema.org/Product">
      {/* TODO: review the following component for mobile */}
        {isMobile && productBasicInfoElem}

        {/* TODO: stop passing isEnabledSocialMedia and start passing SocialMediaLinks as child component */}
        <ProductImages isMobile={isMobile} isEnabledSocialMedia={(!isMobile && !isGiftCard) || isMobile}
          isFullSizeVisible={!isMobile && !isGiftCard} isZoomEnabled={!isGiftCard && !isMobile}
          images={productInfo.imagesByColor[colorProduct.color.name].extraImages}
          colorFormName={productCustomizeFormName} colorFieldName={COLOR_FIELD_NAME} onColorChange={this.handleImagesColorChange}
          isThumbnailListVisible={!isGiftCard} productName={productInfo.name} outfits={outfits} />

        {/* TODO: review the following for mobile */}
        {isMobile && (
          <ProductPrice currencySymbol={currencySymbol} isItemPartNumberVisible={false}
            itemPartNumber={colorProduct.colorDisplayId} {...prices} />
        )}

        <div className="custom-imformation-container">
          {!isMobile && productBasicInfoElem}

          <ContentSlot contentSlotName="pdp_global_promo_pricing" className="product-details-header-promo-text-area" />

          {!isInventoryLoaded
            ? <Spinner />
            : <ProductCustomizeForm initialValues={initialAddToBagFormValues} colorFitSizeDisplayNames={productInfo.colorFitSizeDisplayNames}
                isSizeChartVisible={!isGiftCard} colorFitsSizesMap={productInfo.colorFitsSizesMap} form={productCustomizeFormName}
              onSubmit={this.handleAddItemToBag} onSubmitSuccess={onAddItemToBagSuccess} onColorChange={onColorChange} onChange={this.handleAddToBagFormChange} />
          }

          {isGiftCard && <p className="sending-giftcard">Prefer sending via email?<a href="https://childrensplace.cashstar.com/gift-card/buy/?ref=tcp1">Send an E-Gift Card</a></p>}

          <ContentSlot contentSlotName="pdp_global_promo_add_to_bag" className="product-details-header-promo-text-area" />

          {!isGiftCard && (
            <ProductBopisContainer productInfo={productInfo} formName={productCustomizeFormName}
              miscInfo={colorProduct.miscInfo} />
          )}
        </div>
      </div>
    );
  }

  getProductCustomizeFormName () {
    return 'AddToBagForm-' + this.props.productInfo.generalProductId;
  }

}
