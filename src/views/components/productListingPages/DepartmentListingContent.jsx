/** @module DepartmentListingContent
 * Renders the body of an L1 plp
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlotList} from 'views/components/common/contentSlot/ContentSlotList.jsx';
import {ProductRecommendationsListContainer} from 'views/components/recommendations/ProductRecommendationsListContainer.js';
import {SpotlightContainer} from './SpotlightContainer.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.products-grid.scss');
} else {
  require('./_m.products-grid.scss');
}

export class DepartmentListingContent extends React.Component {
  static propTypes = {
    categoryId: PropTypes.string,

    /** marketing content slot name */
    isShowEspot: PropTypes.bool,
    slotsList: ContentSlotList.propTypes.contentSlots,

    /** flags to hide BV spotlights */
    isHideSpotlights: PropTypes.bool,

    /** Description for the category */
    description: PropTypes.string.isRequired,

    /** Indicates mobile rendering **/
    isMobile: PropTypes.bool.isRequired,

    /** list of all the L2 to display in mobile only */
    navitagionTree: PropTypes.arrayOf(PropTypes.shape({
      /** naming representation to the category */
      name: PropTypes.string.isRequired,
      /** full path to relevant page */
      plpPath: PropTypes.string.isRequired
    })).isRequired
  };

  render () {
    let {isMobile, isShowEspot, isHideSpotlights, categoryId, slotsList, description, navitagionTree} = this.props;
    let containerClassName = cssClassName('main-section-container ', ' grid-container');

    return (
      <main className={containerClassName}>
        <section ref={this.captureContainerDivRef} className="products-grid-container">
          <div className="product-grid-content">
            {isShowEspot && slotsList && <ContentSlotList contentSlots={slotsList} />}
          </div>

          {isMobile && <nav className="navigation-link-container">
            {navitagionTree.map((item) => {
              let {name, plpPath} = item;
              return (<a className="navigation-link" href={plpPath}>{name}</a>);
            })}
          </nav>}
        </section>

        <ProductRecommendationsListContainer />
        {description && <div className="category-description" dangerouslySetInnerHTML={{__html: description}} />}
        {!isHideSpotlights && <SpotlightContainer categoryId={categoryId} />}
      </main>
    );
  }
}
