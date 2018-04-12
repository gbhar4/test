/**
 * @module ProductsGrid
 * @author Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {PlpFilterAndSortFormContainer} from './PlpFilterAndSortFormContainer';
import {NewPlpFilterAndSortFormContainer} from './NewPlpFilterAndSortFormContainer';
import {ProductsGridBlock} from './ProductsGridBlock.jsx';
import {ProductsGridItem} from './ProductsGridItem.jsx';
import {ContentSlotList} from 'views/components/common/contentSlot/ContentSlotList.jsx';
import {isClient} from 'routing/routingHelper';
import {findElementPosition} from 'util/viewUtil/findElementPosition.js';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {ScrollToTopButton} from 'views/components/common/ScrollToTopButton.jsx';
import {SpotlightContainer} from './SpotlightContainer.jsx';
import {ProductMainImage} from 'views/components/product/ProductItemComponents.jsx';
import {CoverShadowLink} from 'views/components/common/CoverShadowLink.jsx';
import {BopisModalContainerQuick} from 'views/components/bopis/BopisModalContainerQuick';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.products-grid.scss');
} else {
  require('./_m.products-grid.scss');
}

// hardcoded value to load products before the end of the products list (400 is about the height of 1 row)
const NEXT_PAGE_LOAD_OFFSET = 400;

export class ProductsGrid extends React.Component {
  static propTypes = {
    /** array of array of products */
    productsBlocks: PropTypes.arrayOf(PropTypes.arrayOf(ProductsGridItem.propTypes.item)).isRequired,

    /** Outfit item definition */
    outfits: PropTypes.arrayOf(PropTypes.shape({
      generalProductId: PropTypes.string.isRequired,
      imagePath: PropTypes.string.isRequired,
      pdpUrl: PropTypes.string.isRequired
    })),

    /** Price related currency symbol to be rendered */
    currencySymbol: ProductsGridItem.propTypes.currencySymbol,

    /** the id of the category */
    categoryId: PropTypes.string,

    /** flags if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,

    /** marketing content slot name */
    isShowEspot: PropTypes.bool,
    slotsList: ContentSlotList.propTypes.contentSlots,

    /** flags to hide BV spotlights */
    isHideSpotlights: PropTypes.bool,

    /** flags to hide back to top button */
    isHideBackToTop: PropTypes.bool,

    /** flags to show filters section */
    isShowFilters: PropTypes.bool.isRequired,

    /** the generalProductId of the product (if any) requesting quickView to show */
    showQuickViewForProductId: PropTypes.string,
    /** callback for clicks on quickView CTAs. Accepts a generalProductId, colorProductId */
    onQuickViewOpenClick: PropTypes.func.isRequired,
    /** callback for clicks on BOPIS CTAs. Accepts: generalProductId, initialValues, colorProductId. Required if isBopisEnabled prop is true. */
    onQuickBopisOpenClick: PropTypes.func,
    /** When flase, flags that BOPIS is globaly disabled */
    isBopisEnabled: PropTypes.bool,
    /** Flags whether the BOPIS modal should be visible */
    isShowBopisModal: PropTypes.bool,
    /** Flags whether products should be grouped by their parent category name */
    isShowCategoryGrouping: PropTypes.bool.isRequired,

    /** callback for clicks on wishlist CTAs. Accepts: colorProductId. */
    onAddItemToFavorites: PropTypes.func,
    /** callback to trigger when the user chooses to display a different color (used to retrieve prices) */
    onColorChange: PropTypes.func.isRequired,

    /** Description for the category */
    description: PropTypes.string.isRequired,

    /** This is needed to render the grid blocks so that they can have unique keys as users play around with filteres, and we re-render the whole grid */
    uniqueGridBlockId: PropTypes.string.isRequired
  };

  constructor (props, context) {
    super(props, context);

    this.state = {
      isLoadingMore: false
    };

    this.captureContainerDivRef = (ref) => { this.containerDivRef = ref; };
    this.handleLoadNextPage = this.handleLoadNextPage.bind(this);
    this.handleScrollToTop = () => window.scrollTo(0, 0);
  }

  componentWillMount () {
    if (isClient()) {
      document.addEventListener('scroll', this.handleLoadNextPage, true);
      document.addEventListener('mousewheel', this.handleLoadNextPage, true);
      document.addEventListener('DOMMouseScroll', this.handleLoadNextPage, true);
    }
  }

  componentWillMount () {
    this.props.onCustomLoadMoreProducts();
    }

  componentWillUnmount () {
    if (isClient()) {
      document.removeEventListener('scroll', this.handleLoadNextPage, true);
      document.removeEventListener('mousewheel', this.handleLoadNextPage, true);
      document.removeEventListener('DOMMouseScroll', this.handleLoadNextPage, true);
    }
  }

  handleLoadNextPage () {
    if (!this.state.isLoadingMore && this.containerDivRef && this.props.productsBlocks.length) {
      let offsetY = findElementPosition(this.containerDivRef).top + this.containerDivRef.offsetHeight;

      if (window.pageYOffset + window.innerHeight + NEXT_PAGE_LOAD_OFFSET > offsetY) {
        this.setState({
          isLoadingMore: true
        });

        this.props.onLoadMoreProducts().then(() => {
          this.setState({
          isLoadingMore: false
        })
      }).catch(() => this.setState({
          isLoadingMore: false
        }));
      }
    }
  }

  render () {
    let {isMobile, isShowEspot, isShowFilters, isHideSpotlights, categoryId, isHideBackToTop,
      onQuickViewOpenClick, onQuickBopisOpenClick, isShowBopisModal, currencySymbol,
      productsBlocks, slotsList, onAddItemToFavorites, outfits, showQuickViewForProductId,
      onColorChange, isBopisEnabled, isShowCategoryGrouping, description, uniqueGridBlockId, isNewMobileFilterForm} = this.props;
    let {isLoadingMore} = this.state;
    let lastCategoryName = null;
    let containerClassName = cssClassName('main-section-container ', ' grid-container');

    return (
      <main className={containerClassName}>
        <section ref={this.captureContainerDivRef} className="products-grid-container">
          {/* DT-33014: AB Test for Mobile Filters */}
          {isShowFilters && !isNewMobileFilterForm && <PlpFilterAndSortFormContainer />}
          {isShowFilters && isNewMobileFilterForm && <NewPlpFilterAndSortFormContainer />}

          <div className="product-grid-content">
            {/* NOTE: DT-31231 We going to have a marketing espot after user's search. */}
            {isShowEspot &&
              (slotsList
                ? <ContentSlotList contentSlots={slotsList} />
                : <ContentSlot contentSlotName="search_result_with_result" className="search-result-slot" />)
            }
            <div className={cssClassName('products-listing-grid ', {'products-listing-grid-without-white-space': !isMobile})}>
              {!!productsBlocks.length && productsBlocks.map((block, index) => {
                let productsAndTitles;

                if (isShowCategoryGrouping) {
                  productsAndTitles = [];

                  for (let product of block) {
                    let {categoryName} = product.miscInfo;
                    if (categoryName && categoryName !== lastCategoryName) {
                      productsAndTitles.push(categoryName);
                      lastCategoryName = categoryName;
                    }
                    productsAndTitles.push(product);
                  }
                } else {
                  productsAndTitles = block;
                }

                return (<ProductsGridBlock key={`${uniqueGridBlockId}_${index}`} productsAndTitles={productsAndTitles} isMobile={isMobile} currencySymbol={currencySymbol}
                  showQuickViewForProductId={showQuickViewForProductId}
                  onQuickViewOpenClick={onQuickViewOpenClick} onQuickBopisOpenClick={onQuickBopisOpenClick}
                  isBopisEnabled={isBopisEnabled} onAddItemToFavorites={onAddItemToFavorites}
                  onColorChange={onColorChange} />);
              })}

              {!!outfits.length && outfits.map((item) => (
                <div className={'outfit-container item-container'} key={item.generalProductId}>
                  <ProductMainImage pdpUrl={item.pdpUrl} imageUrl={item.imagePath} isMobile={isMobile}/>
                  {/* NOTE: as per DT-27998 (minor) this should be shown on mobile too */}
                  {/* NOTE: DT-29875 */}
                  <CoverShadowLink isMobile={isMobile} redirectLink={item.pdpUrl}>
                    <label>SHOP THE LOOK ></label>
                  </CoverShadowLink>
                </div>
              ))}
            </div>
            {isLoadingMore && <Spinner className="loading-more-product">Loading more...</Spinner>}
          </div>
        </section>

        {!isHideBackToTop && <ScrollToTopButton isMobile={isMobile} onClick={this.handleScrollToTop} />}
        {description && <div className="category-description" dangerouslySetInnerHTML={{__html: description}} />}
        {!isHideSpotlights && <SpotlightContainer categoryId={categoryId} />}

        {isShowBopisModal && <BopisModalContainerQuick isShowAddItemSuccessNotification />}
      </main>
    );
  }
}
