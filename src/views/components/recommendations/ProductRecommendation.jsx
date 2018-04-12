/**
 * @module ProductRecommendation
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * One product/outfit recommendation for the ProductRecommendations carrousel.
 *
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {ProductWishlistIcon, ProductCartIcon, ProductPickupIcon, ProductPricesSection} from 'views/components/product/ProductItemComponents.jsx';
import {RECOMMENDED_PRODUCT_PROP_TYPE_SHAPE, RECOMMENDED_OUTFIT_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {QuickViewCardProductCustomizeFormContainer} from 'views/components/productListingPages/QuickViewCardProductCustomizeFormContainer';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import LazyLoad from 'react-lazy-load';

export class ProductRecommendation extends React.Component {

  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    className: PropTypes.string,

    /*
     * Flags whether quickview, bopis, and move to wishlit CTAs should not be visible
     * (note that regardless, these are not shown if isBundledProducts is true)
     */
    isHideQuickCtas: PropTypes.bool,

    /* flags whether this recommendation is for a single product or of many bundled products (i.e, an outfit) */
    isBundledProducts: PropTypes.bool,
    productOrOutfit: PropTypes.oneOfType([RECOMMENDED_PRODUCT_PROP_TYPE_SHAPE, RECOMMENDED_OUTFIT_PROP_TYPE_SHAPE]).isRequired,

    /* indicates the item is already favorited (optional) */
    isFavorited: PropTypes.bool,

    /* operator to add the item to the default wishlist */
    onAddItemToFavorites: PropTypes.func,

    /** flags whether to show the quickview card */
    isShowQuickView: PropTypes.bool,
    /** callback for clicks on quickView CTAs. Accepts: generalProductId
     * Required if isShowQuickView is true.
     */
    onQuickViewOpenClick: PropTypes.func,

    /**
     *  Callback for clicks on BOPIS CTAs. Accepts: generalProductId.
     *  Required if isShowBopisButton prop is true
    */
    onQuickBopisOpenClick: PropTypes.func,

    /** indicates bopis is enabled for the products grid */
    isShowBopisButton: PropTypes.bool,

    /**
     * flags if the price should be inside the link to PDP, as the product image
     * and title always are. Defaults to true.
     */
    isWrapPriceInPdpLink: PropTypes.bool,

    /** indicates monies symbol to represent the product's currency */
    currencySymbol: PropTypes.string.isRequired
  }

  static defaultProps = {
    isWrapPriceInPdpLink: true
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      isFavorited: !!props.isFavorited
    };

    this.setError = getSetErrorInStateMethod(this);
    this.handleAddToWishlist = this.handleAddToWishlist.bind(this);
    this.handleOpenQuickViewClick = () => this.props.onQuickViewOpenClick(this.props.productOrOutfit.generalProductId);
    this.handleQuickBopisOpenClick = () => this.props.onQuickBopisOpenClick(this.props.productOrOutfit.generalProductId);
  }

  handleAddToWishlist () {
    this.setError();
    this.props.onAddItemToFavorites && this.props.onAddItemToFavorites(this.props.productOrOutfit.generalProductId)
    .then(() => {
      this.setState({
        isFavorited: true
      });
    })
    .catch((err) => this.setError(err));
  }

  renderQuickViewCardOrLink () {
    return this.props.isShowQuickView
      ? <QuickViewCardProductCustomizeFormContainer />
      : <ProductCartIcon isMobile={this.props.isMobile} onClick={this.handleOpenQuickViewClick} />;
  }

  render () {
    let {isMobile, className, isBundledProducts, isHideQuickCtas,
      isWrapPriceInPdpLink, productOrOutfit, isShowBopisButton, currencySymbol} = this.props;
    let {isFavorited, error} = this.state;
    let itemClassContainer = cssClassName('item-product-recomendation ', {'outfit-container ': isBundledProducts}, className);

    return (
      <figure className={itemClassContainer}>
        {!isBundledProducts && !isHideQuickCtas &&
          <div className="item-button-container">
            {!isMobile && this.renderQuickViewCardOrLink()}
            <ProductWishlistIcon onClick={this.handleAddToWishlist} isFavorited={isFavorited} activeButton={isFavorited} />
            {!isMobile && isShowBopisButton && <ProductPickupIcon isMobile={isMobile} onClick={this.handleQuickBopisOpenClick} />}
          </div>
        }

        <div className="container-item-recomendation">
          {error && <ErrorMessage error={error} />}

          <a className="product-item-link" href={productOrOutfit.pdpUrl}>
            <ProductImage name={productOrOutfit.name} imagePath={productOrOutfit.imagePath} />
            {!isBundledProducts && <ProductTitle name={productOrOutfit.name} department={productOrOutfit.department}>
              {isWrapPriceInPdpLink && <ProductPricesSection currencySymbol={currencySymbol} listPrice={productOrOutfit.listPrice} offerPrice={productOrOutfit.offerPrice} />}
            </ProductTitle>}
          </a>

          {!isWrapPriceInPdpLink && !isBundledProducts && <ProductPricesSection currencySymbol={currencySymbol} listPrice={productOrOutfit.listPrice} offerPrice={productOrOutfit.offerPrice} />}

          {!isBundledProducts && !isHideQuickCtas && isMobile &&
            <div className="item-button-container">
              {this.renderQuickViewCardOrLink()}
              {isShowBopisButton && <ProductPickupIcon isMobile={isMobile} onClick={this.handleQuickBopisOpenClick} />}
            </div>
          }
        </div>
      </figure>
    );
  }
}

function ProductImage (props) {
  let {imagePath, name} = props;
  return (
    <div className="container-image">
      <LazyLoad offsetVertical={2000} debounce="false" throttle="100">
        <img src={imagePath} alt={'Image for product ' + name} />
      </LazyLoad>
    </div>
  );
}

function ProductTitle (props) {
  let {children, name, department} = props;
  return (
    <figcaption className="product-description">
      <h3 className="department-name">{(department && department.length > 0) ? department + ' -' : ''} {name}</h3>
      {children}
    </figcaption>
  );
}
