/** @module FullSizeImageModal
 * @summary Show a modal with the images for all the swatches/colors of a
 * product.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ProductColorChipsSelector} from 'views/components/product/formDetails/ProductColorChipsSelector.jsx';
import {ProductImages} from './ProductImages.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {PRODUCT_INFO_PROP_TYPE_SHAPE} from 'views/components/common/propTypes/productsAndItemsPropTypes.js';
import {ShadowField} from 'reduxStore/util/ShadowField.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.image-details-modal.scss');
} else {
  require('./_m.image-details-modal.scss');
}

export class FullSizeImageWithQuickViewModal extends React.Component {
  static propTypes = {
    /** information of the product whose images to show */
    productInfo: PRODUCT_INFO_PROP_TYPE_SHAPE.isRequired,

    /** list of images of the product */
    images: PropTypes.arrayOf(PropTypes.shape({
      iconSizeImageUrl: PropTypes.string.isRequired,
      regularSizeImageUrl: PropTypes.string.isRequired,
      bigSizeImageUrl: PropTypes.string.isRequired,
      superSizeImageUrl: PropTypes.string.isRequired
    })).isRequired,

    /** The from and field name holding the currently selected color we need to track */
    colorFormName: PropTypes.string,
    colorFieldName: PropTypes.string,

    /** function to call to close this modal */
    onCloseClick: PropTypes.func.isRequired,

    /** Whether to render for mobile. */
    isMobile: PropTypes.bool.isRequired,

    /**
     * Function to call when the color has changed. The function will receive
     * the new color's name as it's only parameter.
     */
    onColorChange: PropTypes.func,

    /** Flags if the thumnails should be visible. */
    isThumbnailListVisible: PropTypes.bool
  }

  render () {
    let {isMobile, onCloseClick, productInfo, isThumbnailListVisible, onColorChange, colorFormName, colorFieldName, images} = this.props;

    return (
      <Modal isOpen contentLabel="Image preview" className="overlay-container overlay-image-details"
        overlayClassName="react-overlay overlay-center">
        <ModalHeaderDisplayContainer title={productInfo.name} onCloseClick={onCloseClick} />

        <div className="overlay-content">
          <ShadowField component={ProductColorChipsSelector} isBiDirectional adaptToForm={colorFormName} adaptToField={colorFieldName}
            colorFitsSizesMap={productInfo.colorFitsSizesMap} input={{onChange: onColorChange, name: 'color'}} />
          <ProductImages productName={productInfo.name} isMobile={isMobile} images={images}
            isFullSizeVisible={false} isShowBigSizeImages isZoomEnabled={false} isThumbnailListVisible={isThumbnailListVisible} />
        </div>
      </Modal>
    );
  }
}
