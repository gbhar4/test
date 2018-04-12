/** @module ProductsGridItem
 * @summary renders a single product in a PLP.
 *
 * @author Gabriel Gomez
 * @author Miguel
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';

import {
  MISC_INFO_PROP_TYPES_SHAPE,
  PRODUCT_INFO_PROP_TYPE_SHAPE,
  COLOR_PROP_TYPE,
  PRODUCT_INFO_PROP_TYPES
} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {ProductMainImage, ProductTitle, ProductPricesSection, ProductWishlistIcon, ProductCartIcon, ProductPickupIcon, BadgeItem}
  from 'views/components/product/ProductItemComponents.jsx';
import {ProductColorChips} from 'views/components/product/ProductColorChips.jsx';
import {ProductAltImages} from 'views/components/product/ProductAltImages.jsx';
import {QuickViewCardProductCustomizeFormContainer} from 'views/components/productListingPages/QuickViewCardProductCustomizeFormContainer';
import {getMapSliceForColorProductId} from 'util/viewUtil/productsCommonUtils.js';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-plp.scss');
} else {
  require('./_m.product-plp.scss');
}

export class ProductsGridItem extends React.PureComponent {
  static propTypes = {
    /** */
    isMobile: PropTypes.bool.isRequired,

    item: PropTypes.shape({
      productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,
      miscInfo: MISC_INFO_PROP_TYPES_SHAPE.isRequired,

      colorsMap: PropTypes.arrayOf(PropTypes.shape({
        color: COLOR_PROP_TYPE.isRequired,
        colorProductId: PropTypes.string.isRequired,
        miscInfo: MISC_INFO_PROP_TYPES_SHAPE.isRequired
      })).isRequired,

      imagesByColor: PRODUCT_INFO_PROP_TYPES.imagesByColor.isRequired

      /* TODO: Per Ben's request, commenting availability until Product defines what to do with badges */
      // availability: ITEM_INFO_PROP_TYPES.availability.isRequired
    }),

    /** When flase, flags that BOPIS is globaly disabled */
    isBopisEnabled: PropTypes.bool,
    /** flags whether to show the quickview card */
    isShowQuickView: PropTypes.bool.isRequired,
    /** callback for clicks on quickView CTAs. Accepts: generalProductId, colorProductId */
    onQuickViewOpenClick: PropTypes.func.isRequired,

    /** callback for clicks on BOPIS CTAs. Accepts: generalProductId, initialValues, colorProductId. Required if isBopisEnabled prop is true. */
    onQuickBopisOpenClick: PropTypes.func,
    /** callback for clicks on wishlist CTAs. Accepts: colorProductId. */
    onAddItemToFavorites: PropTypes.func,

    /** indicates monies symbol to represent the product's currency */
    currencySymbol: PropTypes.string.isRequired,

    /**
     *  Callback to trigger when the user chooses to display a different color.
     *  Accepts colorProductId.
     *  Returns a promise that resolves to an object with the structure MISC_INFO_PROP_TYPES_SHAPE.
     */
    onColorChange: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);

    this.colorsExtraInfo = {
      [props.item.colorsMap[0].color.name]: props.item.colorsMap[0].miscInfo
    };

    this.state = {
      isInDefaultWishlist: props.item.miscInfo.isInDefaultWishlist,
      selectedColorProductId: props.item.colorsMap[0].colorProductId,
      currentImageIndex: 0
    };

    this.setError = getSetErrorInStateMethod(this);
    this.handleAddToWishlist = this.handleAddToWishlist.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleQuickBopisOpenClick = this.handleQuickBopisOpenClick.bind(this);
    this.handleOpenQuickViewClick = () => this.props.onQuickViewOpenClick(this.props.item.productInfo.generalProductId, this.state.selectedColorProductId);
    this.handleImageChange = (index) => this.setState({currentImageIndex: index});
  }

  // DT-32496
  // When using the back button isInDefaultWishlist gets set to undefined in constructor
  // Need to update the value when we receive the latest props
  componentWillReceiveProps (nextProps) {
    let { item: { miscInfo: { isInDefaultWishlist } } } = nextProps;

    if (this.state.isInDefaultWishlist === undefined) {
      this.setState({ isInDefaultWishlist });
    }
  }


  handleQuickBopisOpenClick () {
    let colorEntry = getMapSliceForColorProductId(this.props.item.colorsMap, this.state.selectedColorProductId);
    this.props.onQuickBopisOpenClick(
      this.props.item.productInfo.generalProductId,
      {color: colorEntry && colorEntry.color.name},
      this.state.selectedColorProductId);
  }

  handleChangeColor (colorProductId, colorName) {
    if (this.colorsExtraInfo[colorName]) {          // if already loaded the extra info for this color
      this.setState({selectedColorProductId: colorProductId, currentImageIndex: 0});
    } else {
      this.props.onColorChange(colorProductId)
      .then((colorExtraInfo) => {
        this.colorsExtraInfo[colorName] = colorExtraInfo;
        this.setState({selectedColorProductId: colorProductId, currentImageIndex: 0});
      });
    }
  }

  handleAddToWishlist () {
    let {item: {productInfo: {generalProductId}}} = this.props;

    this.setError();

    this.props.onAddItemToFavorites(this.state.selectedColorProductId || generalProductId)
    .then(() => this.setState({isInDefaultWishlist: true}))
    .catch((err) => this.setError(err));
  }

  renderQuickViewCardOrLink () {
    return this.props.isShowQuickView
      ? <QuickViewCardProductCustomizeFormContainer initialValues={this.getQuickViewInitialValues()} />
      : <ProductCartIcon isMobile={this.props.isMobile} onClick={this.handleOpenQuickViewClick} />;
  }

  render () {
    let {
      isMobile, currencySymbol, isBopisEnabled,
      item: {
        productInfo: {generalProductId, name, pdpUrl},
        colorsMap, imagesByColor, productInfo
      }
    } = this.props;
    let {isInDefaultWishlist, selectedColorProductId, error, currentImageIndex} = this.state;

    let curentColorEntry = getMapSliceForColorProductId(colorsMap, selectedColorProductId);
    let imageUrls = imagesByColor[curentColorEntry.color.name].extraImages.map((imageEntry) => imageEntry.regularSizeImageUrl);

    let currentColorMiscInfo = this.colorsExtraInfo[curentColorEntry.color.name] || curentColorEntry.miscInfo || {};

    let {
      listPrice: listPriceForColor = productInfo.listPrice,
      offerPrice: offerPriceForColor = productInfo.offerPrice,
      isBopisEligible, badge1, badge2, badge3
    } = currentColorMiscInfo;
    let isShowBadges = currentImageIndex === 0;
    let isShowBopis = isBopisEnabled && isBopisEligible && !productInfo.isGiftCard;

    return (
      <li className="item-container" key={generalProductId} onMouseEnter={this.handleOpenAltImages} onMouseOut={this.handleCloseAltImages}>
        <div className="item-button-container">
          {!isMobile && this.renderQuickViewCardOrLink()}
          <ProductWishlistIcon onClick={this.handleAddToWishlist} activeButton={isInDefaultWishlist} />
          {!isMobile && isShowBopis && <ProductPickupIcon isMobile={isMobile} onClick={this.handleQuickBopisOpenClick} />}
        </div>

        {isShowBadges && <BadgeItem className="top-badge-container" text={badge1} />}

        {(isMobile || imageUrls.length < 2)
          ? <ProductMainImage pdpUrl={pdpUrl} imageUrl={imageUrls[0]} productName={name} isMobile={isMobile}/>
          : <ProductAltImages pdpUrl={pdpUrl} imageUrls={imageUrls} productName={name} onImageChange={this.handleImageChange} />
        }

        {(colorsMap.length > 1) && <ProductColorChips onChipClick={this.handleChangeColor}
          selectedColorId={curentColorEntry.color.name} colorsMap={colorsMap} isMobile={isMobile} />}

        <ProductTitle name={name} pdpUrl={pdpUrl} >
          {isShowBadges && <BadgeItem className="inline-badge-container" text={badge2} />}
        </ProductTitle>

        <ProductPricesSection currencySymbol={currencySymbol} listPrice={listPriceForColor} offerPrice={offerPriceForColor} />

        {isShowBadges && <BadgeItem className="merchant-badge-container" text={badge3} />}

        {isMobile && <div className="buttons-container">
          {this.renderQuickViewCardOrLink()}
          {isShowBopis && <ProductPickupIcon isMobile={isMobile} onClick={this.handleQuickBopisOpenClick} />}
        </div>}

        {error && <ErrorMessage error={error} />}
      </li>
    );
  }

  // ------------------ protected methods ------------------- //

  getQuickViewInitialValues () {
    let {item: {colorsMap}} = this.props;
    let colorEntry = colorsMap.find((entry) => entry.colorProductId === this.state.selectedColorProductId);
    return colorEntry
      ? {color: colorEntry.color.name}
      : undefined;
  }
}
