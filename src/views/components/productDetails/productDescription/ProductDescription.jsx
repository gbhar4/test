/** @module PDP - ProductDescription
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * TODO: this component will be finished by Agu, who will implement the Show More functionality,
 * show only "three lines" before it is clicked, as requested by DT-670. For now, I'm leaving
 * Florencia's implementation, which at least seems to work from the user perspective.
 */

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-description.scss');
} else {
  require('./_m.product-description.scss');
}

class ProductDescription extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,

    productInfo: PropTypes.shape({
      itemPartNumber: PropTypes.string.isRequired,

      /* Short description of the product. */
      shortDescription: PropTypes.string.isRequired,

      /* Long description of the product thay may include HTML. */
      longDescription: PropTypes.string.isRequired
    })
  }

  constructor (props) {
    super(props);

    this.state = {
      isShowMore: !!props.isShowMore
    };

    this.handleToggleShowMoreOrLess = this.handleToggleShowMoreOrLess.bind(this);
  }

  handleToggleShowMoreOrLess () {
    this.setState({
      isShowMore: !this.state.isShowMore
    });
  }

  render () {
    let {isMobile, itemPartNumber, shortDescription, longDescription} = this.props;
    let {isShowMore} = this.state;

    let buttonShowMoreOrLess = null;
    let maxHeightOfContainer = null;

    if (isShowMore) {
      maxHeightOfContainer = {
        'maxHeight': 'auto',
        'overflow': 'visible'
      };
      buttonShowMoreOrLess = <button className="button-show-less" onClick={this.handleToggleShowMoreOrLess}>Show Less</button>;
    } else {
      maxHeightOfContainer = {
        'maxHeight': isMobile ? 'auto' : '42px',
        'overflow': isMobile ? 'visible' : 'hidden'
      };
      buttonShowMoreOrLess = <button className="button-show-more" onClick={this.handleToggleShowMoreOrLess}>Show More</button>;
    }

    return (
      <section className="product-description-list">
        {!isMobile && <h4 className="title-product-description">Product Description</h4>}

        {shortDescription && <div style={maxHeightOfContainer} className="introduction-text">
          {shortDescription}
          <div dangerouslySetInnerHTML={{__html: longDescription}} />
          <br />
          <aside className="claim-message">Big Fashion, Little Prices</aside>
          {isMobile && <strong className="product-id">Item #: {itemPartNumber}</strong>}
        </div>}

        {!isMobile && buttonShowMoreOrLess}
      </section>
    );
  }
}

export {ProductDescription};
