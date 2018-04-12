/**
 * @module MyBagEmpty
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Lays out the shopping cart components when such cart is empty.
 *
 * Usage:
 *  <MyBagEmpty isMobile=[boolean] espotContent=[string] />
 *
 * Uses:
 *  <ProductRecommendationsListContainer />
 *  <ContentSlot />
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {ProductRecommendationsListContainer} from 'views/components/recommendations/ProductRecommendationsListContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';

export class MyBagEmpty extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isCondense: PropTypes.bool,
    espotContent: PropTypes.string
  }

  render () {
    let {isMobile, isCondense} = this.props;
    let containerClassName = cssClassName('my-bag container-global-my-bag');
    let contentClassName = cssClassName('global-my-bag ', {'viewport-container ': !isMobile});

    return (
      <section className={containerClassName}>
        <div className={contentClassName}>
          <div className="empty">
            <h1>Your shopping bag is empty.</h1>

            {!isCondense && <p>Your shopping bag is empty.
              Shopping bags are saved for 14 days for account holders.
              Try logging in to your account to view a saved shopping bag.
              If you don't see your items you may have not made your selections correctly on the product page.
              Please return to the product page and try again.
            </p>}

            {isMobile && <HyperLink destination={PAGES.homePage} title="Go Shopping"> <button className="button-go-shopping button-primary" title="Go Shopping">Go Shopping</button> </HyperLink>}

          </div>
        </div>

        <ProductRecommendationsListContainer />
        <div className="empty"><ContentSlot contentSlotName="bag_empty_banner" className="fpo-banner-rewards-slot" /></div>
      </section>
    );
  }
}
