/**
 * @module ProductRecommendationsList
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 * Component for showing product recommendations for the user. The
 * recommendations list now works as a carousel, with parameters to decide how
 * many products to show and how many products to move on each step. As a carousel,
 * when a page reaches the end of the data array, it first shows the last products
 * of the array and then the first ones.
 *
 * Usage:
 *      <ProductRecommendations />
 *
 * Component Props description/enumeration:
 *  @param {array} products: array with product recommendations data.
 *  @param {number} maxVisibleProducts: maximum number of products that will be
 *    visible at the same time.
 *  @param {number} stepSize: number of positions to move each time the user
 *    moves one step in any direction. Defaults to maxVisibleProducts.
 *
 * Style (className) Elements description/enumeration:
 *  .product-recomendation
 *
 * Uses:
 *      <ProductRecommendation />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ProductRecommendation} from './ProductRecommendation.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {CoverShadowLink} from 'views/components/common/CoverShadowLink.jsx';
import {BopisModalContainerQuick} from 'views/components/bopis/BopisModalContainerQuick';
import {Accordion} from 'views/components/accordion/Accordion.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-recomendation.scss');
} else {
  require('./_m.product-recomendation.scss');
}

export class ProductRecommendationsList extends React.Component {

  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /** indicates recommendations need to be rendered as an accordion element
     * (mobile pdp or outfit)
     **/
    isAccordion: PropTypes.bool,

    /** indicates recommendations accordion should be open by default
     * (mobile pdp or outfit)
     **/
    isAccordionExpanded: PropTypes.bool,

    /**
     * title to use in accordion in case isAccordion is true
     */
    accordionTitle: PropTypes.string,

    /* Flags that this recommendation is not for a single product but of many bundled products (i.e, an outfit) */
    isBundledProducts: PropTypes.bool,

    /** the list of products or outfits to render */
    products: PropTypes.arrayOf(ProductRecommendation.propTypes.productOrOutfit).isRequired,

    /** maximum number of products that will be visible at the same time (defaults to 4) */
    maxVisibleProducts: PropTypes.number.isRequired,
    /** the number of positions to move each time the user clicks the next or previous buttons
     * If not specified defaults to maxVisibleProducts.
     */
    stepSize: PropTypes.number,
    /** the index into products of the first product to show when this component first mounts */
    startFirstIndex: PropTypes.number,

    /* operator to add the item to the default wishlist */
    onAddItemToFavorites: PropTypes.func.isRequired,

    /** the generalProductId of the product (if any) requesting quickView to show */
    showQuickViewForProductId: PropTypes.string,
    /** callback for clicks on quickView CTAs. Accepts a generalProductId */
    onQuickViewOpenClick: PropTypes.func.isRequired,
    /**
     *  Callback for clicks on BOPIS CTAs. Accepts: generalProductId.
     *  Required if isShowBopisButton prop is true
    */
    onQuickBopisOpenClick: PropTypes.func,
    /** indicates bopis is enabled for the products grid */
    isShowBopisButton: PropTypes.bool,
    /** Flags whether the BOPIS modal should be visible */
    isShowBopisModal: PropTypes.bool,
    /** indicates monies symbol to represent the product's currency */
    currencySymbol: PropTypes.string.isRequired,

    /** Title to recommendations list. There is a default title if nothing is passed. */
    recommendationsListTitle: PropTypes.string
  }

  static defaultProps = {
    maxVisibleProducts: 4
  }

  constructor (props) {
    super(props);
    this.state = {
      firstProductIndex: props.startFirstIndex || 0,
      activeProduct: 0

    };

    this.captureContainerRef = this.captureContainerRef.bind(this);

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);

    this.scrollToNextProduct = this.scrollToNextProduct.bind(this);
    this.scrollToPreviousProduct = this.scrollToPreviousProduct.bind(this);
    this.scrollToTargetCoupon = this.scrollToTargetCoupon.bind(this);
    this.scrollListSnap = this.scrollListSnap.bind(this);
  }

  // NOTE: should not wrap around, no circular list
  handleNextClick () {
    let stepSize = this.props.stepSize || this.props.maxVisibleProducts;
    let nextStartIndex = this.state.firstProductIndex + stepSize;
    let maxViewableIndex = this.props.products.length - stepSize;
    let isEndBounded = nextStartIndex >= maxViewableIndex;
    let firstProductIndex = isEndBounded ? maxViewableIndex : nextStartIndex;
    this.setState({firstProductIndex: firstProductIndex});
  }

  handlePreviousClick () {
    let stepSize = this.props.stepSize || this.props.maxVisibleProducts;
    let nextStartIndex = this.state.firstProductIndex - stepSize;
    let maxViewableIndex = 0;
    let isEndBounded = nextStartIndex <= maxViewableIndex;
    let firstProductIndex = isEndBounded ? maxViewableIndex : nextStartIndex;
    this.setState({firstProductIndex: firstProductIndex});
  }

  getPageProducts () {
    if (this.props.isMobile) return this.props.products;

    let {stepSize, products, maxVisibleProducts} = this.props;
    stepSize = stepSize || maxVisibleProducts;

    let firstProductIndex = this.state.firstProductIndex;

    // If number of items returned is <= the step size return all products
    // Else If next page will not put you out of bound return next page
    // Else return last stepSize set of products
    if (products.length <= stepSize) {
      return products;
    } else if (firstProductIndex + stepSize < products.length) {
      return products.slice(firstProductIndex, firstProductIndex + stepSize);
    } else {
      return products.slice(products.length - stepSize, products.length);
    }
  }

  captureContainerRef (ref) {
    this.containerRef = ref;
    ref && ref.addEventListener('scroll', this.scrollListSnap, true);
  }

  scrollToPreviousProduct () {
    // onTouchStart still fires when button is disabled
    // Return immediately if at the beginning of the list
    if (this.state.activeProduct === 0) {
      return;
    }

    let products = this.getPageProducts();
    let length = products.length;
    let activeProduct = (this.state.activeProduct - 1 + length) % length;
    this.containerRef.scrollLeft = activeProduct * this.containerRef.offsetWidth;

    this.setState({
      activeProduct: activeProduct
    });
  }

  scrollToNextProduct () {
    let products = this.getPageProducts();
    let length = products.length;
    let activeIndex = this.state.activeProduct + 1;

    // onTouchStart still fires when button is disabled
    // Return immediately if at the end of the list
    if (activeIndex === length) {
      return;
    }

    let activeProduct = activeIndex % length;
    this.containerRef.scrollLeft = activeProduct * this.containerRef.offsetWidth;

    this.setState({
      activeProduct: activeProduct
    });
  }

  scrollListSnap () {
    if (this.scrollListSnapTimeout) {
      clearTimeout(this.scrollListSnapTimeout);
    }

    // scroll triggers on every pixel, we need some cooldown to identify when the scroll stopped
    this.scrollListSnapTimeout = setTimeout(() => {
      let scrollLeft = this.containerRef.scrollLeft;
      let elementWidth = this.containerRef.offsetWidth;
      let activeProduct = Math.round(scrollLeft / elementWidth);

      if (this.state.activeProduct !== activeProduct) {
        this.setState({
          activeProduct: activeProduct
        });
      }

      this.containerRef.scrollLeft = activeProduct * elementWidth;
    }, 100);
  }

  scrollToTargetCoupon (event) {
    let activeProduct = parseInt(event.target.attributes['data-index'].value);
    this.containerRef.scrollLeft = activeProduct * this.containerRef.offsetWidth;

    this.setState({
      activeProduct: activeProduct
    });
  }

  render () {
    let {isAccordion, accordionTitle, products, isAccordionExpanded} = this.props;

    if (products.length === 0) return null;

    if (isAccordion) {
      return (<Accordion title={accordionTitle} expanded={isAccordionExpanded}>
        {this.renderContent()}
      </Accordion>);
    } else {
      return this.renderContent();
    }
  }

  renderContent () {
    let {isMobile, isAccordion, products, maxVisibleProducts, onAddItemToFavorites, showQuickViewForProductId, currencySymbol,
      isBundledProducts, onQuickViewOpenClick, onQuickBopisOpenClick, isShowBopisModal, isShowBopisButton, recommendationsListTitle} = this.props;
    let {activeProduct} = this.state;

    let isJustOnePage = products.length <= maxVisibleProducts;

    let classNameRecomendations = cssClassName('product-recomendation ', {'viewport-container': !isMobile});
    return (
      <section className="product-recomendation-container">
        <div className={classNameRecomendations}>
          {!isAccordion && <h2 className="heading-product-recomendation">{recommendationsListTitle}</h2>}

          <div className="container-product-recomendation">

            {!isMobile
              ? !isJustOnePage && <button className="button-prev" title="Previous" onClick={this.handlePreviousClick}
                disabled={this.state.firstProductIndex === 0}></button>
              : <button className="button-prev" title="Previous" onTouchStart={this.scrollToPreviousProduct}
                disabled={activeProduct === 0}></button>}

            <ol className="content-product-recomendation" ref={this.captureContainerRef}>
              {this.getPageProducts().map((item) =>
                <li key={item.generalProductId} className={`${isBundledProducts ? 'outfit' : 'product'}-rec-list-item`} onClick={this.handleTileClick}>
                  <ProductRecommendation productOrOutfit={item} currencySymbol={currencySymbol} isMobile={isMobile} isBundledProducts={isBundledProducts} onAddItemToFavorites={onAddItemToFavorites}
                    onAddItemToFavorites={onAddItemToFavorites} isShowQuickView={showQuickViewForProductId === item.generalProductId}
                    onQuickViewOpenClick={onQuickViewOpenClick} onQuickBopisOpenClick={onQuickBopisOpenClick} isShowBopisButton={isShowBopisButton} />

                  {!isMobile && isBundledProducts &&
                    <CoverShadowLink redirectLink={item.pdpUrl}>
                      <label>SHOP THE LOOK ></label>
                    </CoverShadowLink>}

                  {!isMobile && !isBundledProducts &&
                    <CoverShadowLink redirectLink={item.pdpUrl} className="cover-invisible" />}
                </li>
               )}
            </ol>

            {isMobile && <div className="coupon-dots">
              {this.getPageProducts().map((coupon, index) => {
                let paginationDotClass = cssClassName('button-pagination-dot ', {'active': index === activeProduct});
                return (<button key={index} className={paginationDotClass} data-index={index} onClick={this.scrollToTargetCoupon}>&bull;</button>);
              })}
            </div>}

            {!isMobile
              ? !isJustOnePage && <button className="button-next" title="Next" onClick={this.handleNextClick}
                disabled={this.state.firstProductIndex + maxVisibleProducts === products.length}></button>
              : <button className="button-next" title="Next" onTouchStart={this.scrollToNextProduct}
                disabled={activeProduct + 1 === products.length}></button>}

            {!isMobile && isShowBopisModal && <BopisModalContainerQuick isShowAddItemSuccessNotification />}
          </div>
        </div>
      </section>
    );
  }
}
