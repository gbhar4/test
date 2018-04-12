/** @module OutfitProduct
 * @summary Renders a single product in an outfit PDP.
 *
 *  @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
// import cssClassName from 'util/viewUtil/cssClassName';
import {PRODUCT_INFO_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {ProductBasicInfo} from '../ProductBasicInfo.jsx';
import {getMapSliceForColorProductId, getDefaultFitForColorSlice, getDefaultSizeForProduct} from 'util/viewUtil/productsCommonUtils.js';
import {OutfitProductForm} from './OutfitProductForm.jsx';

export class OutfitProduct extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,

    /* The session currency symbol */
    currencySymbol: PropTypes.string.isRequired,
    /** the product to display */
    productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,

    /** Callback for adding an item to bag. Accepts two params: productInfo, formData.
    * The productInfo is like the prop of this object, and form data contains the keys: color, fit, size, quantity.
    */
    onAddItemToBag: PropTypes.func.isRequired,

    /** Function to call when the color has changed. Accepts: generalProductId, colorProductId */
    onColorChange: PropTypes.func.isRequired,
    /** Flag to know if outfit was added to bag. If it is success, section should show Add to Bag Notification (modal) */
    onSubmitSuccess: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    let {productInfo: {generalProductId, colorFitsSizesMap}} = props;

    let colorFitsSizesMapEntry = getMapSliceForColorProductId(colorFitsSizesMap, generalProductId);
    this.initialAddToBagFormValues = {
      color: colorFitsSizesMapEntry.color.name,
      fit: getDefaultFitForColorSlice(colorFitsSizesMapEntry).fitName,
      size: props.productInfo.isGiftCard
        ? props.productInfo.colorFitsSizesMap[0].fits[0].sizes[0].sizeName      // on gift card we need something selected, otherwise no price would show up
        : getDefaultSizeForProduct(props.productInfo.colorFitsSizesMap),
      quantity: 1
    };

    this.state = {addToBagFormValues: this.initialAddToBagFormValues};

    this.handleAddToBagFormChange = (formData) => this.setState({addToBagFormValues: formData});
    this.handleAddItemToBag = (formData) => this.props.onAddItemToBag(this.props.productInfo, formData);
    this.handleColorChange = (colorProductId) => this.props.onColorChange(this.props.productInfo.generalProductId, colorProductId);
  }

  render () {
    let {currencySymbol, productInfo, onSubmitSuccess,
      productInfo: {generalProductId, colorFitsSizesMap, colorFitSizeDisplayNames, isGiftCard}
    } = this.props;
    let {addToBagFormValues, addToBagFormValues: {color}} = this.state;

    return (
      <div className="outfit-item-container">
        <figure className="outfit-item-figure-container">
          <a className="outfit-item-link" href={productInfo.pdpUrl}>
            <img className="outfit-item-image" src={productInfo.imagesByColor[color].basicImageUrl} alt={`Product Image for color: ${color}`} />
          </a>
          {/* NOTE: added link to mobile and desktop, as per requirement of DT-27968. Before this, link should be displayed only for desktop. */}
          <a className="outfit-item-details-link" href={productInfo.pdpUrl}>View Product Details</a>
        </figure>
        <ProductBasicInfo pdpUrl={productInfo.pdpUrl} productInfo={productInfo} {...addToBagFormValues}
          currencySymbol={currencySymbol} isPriceVisible isRatingsVisible isShowFavoriteCount />

        <OutfitProductForm onSubmitSuccess={onSubmitSuccess} form={'OutfitProductForm-' + generalProductId} initialValues={this.initialAddToBagFormValues} colorFitSizeDisplayNames={colorFitSizeDisplayNames}
          isSizeChartVisible={!isGiftCard} colorFitsSizesMap={colorFitsSizesMap} onColorChange={this.handleColorChange}
          onSubmit={this.handleAddItemToBag} onChange={this.handleAddToBagFormChange} />
      </div>
    );
  }

}
