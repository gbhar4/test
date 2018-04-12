/** @module CardProductCustomizeForm
 *
 * @summary A Card rendering a ProductCustomizeForm.
 *
 * Any extra props other than <code>productInfo, onMount, onCloseClick, colorFitsSizesMap, colorFitSizeDisplayNames, onSubmit</code>,
 * e.g., <code>onSubmitSuccess, onColorChange</code>, passed to this component will be passed along to the rendered <code>ProductCustomizeForm</code>.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ProductCustomizeForm} from 'views/components/productDetails/ProductCustomizeForm.jsx';
import {PRODUCT_INFO_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {DisplayCard} from 'views/components/common/DisplayCard.jsx';
import {Modal} from 'views/components/modal/Modal.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.product-quickview.scss');
} else {
  require('./_m.product-quickview.scss');
}

export class CardProductCustomizeForm extends React.Component {
  static propsTypes = {
    /** the product to customize */
    productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,

    /** Callback for submitting the form. Accepts productInfo, formValues (of ProductCustomizeForm). */
    onSubmit: PropTypes.func.isRequired,

    /** Callback for when the close button of this Card is clicked. Accepts the click event object. */
    onCloseClick: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.renderCardChildren = this.renderCardChildren.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  renderCardChildren () {
    let {isMobile,
      productInfo: {colorFitsSizesMap, colorFitSizeDisplayNames, pdpUrl},
      productInfo, onSubmit, onMount, onCloseClick,            /// eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;
    return (
      <div>
        <ProductCustomizeForm colorFitsSizesMap={colorFitsSizesMap} colorFitSizeDisplayNames={colorFitSizeDisplayNames}
          onSubmit={this.handleSubmit} isSelectedValuesVisibleInLabels={false} {...otherProps} />
        <a className="link-redirect" href={pdpUrl}>View Product Details</a>
      </div>
    );
  }

  handleSubmit (formData) {
    return this.props.onSubmit(this.props.productInfo, formData)
    .then((res) => {
      this.props.onCloseClick();
      return res;
    });
  }

  render () {
    let {onCloseClick, isMobile} = this.props;
    return (
      isMobile ? (
        <Modal className="overlay-container" contentLabel="Add to Bag modal" overlayClassName="quickview-overlay react-overlay" preventEventBubbling isOpen>
          <DisplayCard className="quickview-container" buttonClassName="button-close" onCloseClick={onCloseClick}>
            {this.renderCardChildren}
          </DisplayCard>
        </Modal>
      ) : (
        <DisplayCard className="quickview-container" buttonClassName="button-close" onCloseClick={onCloseClick}>
          {this.renderCardChildren}
        </DisplayCard>
      )
    );
  }
}
