/** @module PDP - ProductImages
 * Shows all the images for a given product as a gallery.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */
import React from 'react';
import PropTypes from 'prop-types';
import {SocialMediaLinks} from 'views/components/socialMedia/SocialMediaLinks.jsx';
import {ThumbnailsList} from './ThumbnailsList.jsx';
import {Image} from './viewImage/Image.jsx';
import {ImageCtas} from './ImageCtas.jsx';
import {FullSizeImageWithQuickViewModalContainer} from './FullSizeImageWithQuickViewModalContainer.js';
import {FullSizeImageModal} from './FullSizeImageModal.jsx';
import {CompleteTheLookCTA} from './CompleteTheLookCTA.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.display-image-product.scss');
} else {
  require('./_m.display-image-product.scss');
}

export class ProductImages extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,

    /** Product's Name (global product, not by color, size, fit or some clasification) */
    productName: PropTypes.string.isRequired,

    /** list of images of the product */
    images: PropTypes.arrayOf(PropTypes.shape({
      iconSizeImageUrl: PropTypes.string.isRequired,
      regularSizeImageUrl: PropTypes.string.isRequired,
      bigSizeImageUrl: PropTypes.string.isRequired,
      superSizeImageUrl: PropTypes.string.isRequired
    })).isRequired,

    /** The from and field names holding the currently selected color we need to track if the fullSizeModal is open */
    colorFormName: PropTypes.string,
    colorFieldName: PropTypes.string,

    /** flags if the full size button should be visible */
    isFullSizeVisible: PropTypes.bool.isRequired,

    /**
     * Flags if we should show big size images, instead of regular size
     * images (default behavior)
     */
    isShowBigSizeImages: PropTypes.bool,

    /** Flags if the zoom should be enabled */
    isZoomEnabled: PropTypes.bool.isRequired,

    /**
     * Function to call when the color has changed. The function will receive
     * the new color's name as it's only parameter.
     */
    onColorChange: PropTypes.func,

    /** Flags if the thumnails should be visible. */
    isThumbnailListVisible: PropTypes.bool,

    /* TODO: replace with SocialMediaLinks renamed to ProductSocialMedia, and receiving it as a child of this component */
    isEnabledSocialMedia: PropTypes.bool
  }

  state = {
    currentImageIndex: 0,
    isFullSizeModalOpen: false
  }

  constructor (props) {
    super(props);

    this.handleThumbnailClick = this.handleThumbnailClick.bind(this);
    this.handleNextImageClick = this.handleNextImageClick.bind(this);
    this.handlePreviousImageClick = this.handlePreviousImageClick.bind(this);
    this.handleShowFullSizeModalClick = this.handleShowFullSizeModalClick.bind(this);
    this.handleCloseFullSizeModalClick = this.handleCloseFullSizeModalClick.bind(this);
  }

  handleThumbnailClick (imageIndex) {
    this.setState({currentImageIndex: imageIndex});
  }

  handleNextImageClick () {
    let {images} = this.props;
    let {currentImageIndex} = this.state;
    if (currentImageIndex < images.length - 1) {
      this.setState({currentImageIndex: ++currentImageIndex});
    }
  }

  handlePreviousImageClick () {
    let {currentImageIndex} = this.state;
    if (currentImageIndex > 0) {
      this.setState({currentImageIndex: --currentImageIndex});
    }
  }

  handleShowFullSizeModalClick () {
    this.setState({isFullSizeModalOpen: true});
  }

  handleCloseFullSizeModalClick () {
    this.setState({isFullSizeModalOpen: false});
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.images !== nextProps.images) {
      this.setState({currentImageIndex: 0});
    }
  }

  render () {
    let {isMobile, productName, images, isEnabledSocialMedia, colorFormName, colorFieldName,
      isFullSizeVisible, isShowBigSizeImages, onColorChange, isZoomEnabled,
      isThumbnailListVisible, outfits} = this.props;
    let {currentImageIndex, isFullSizeModalOpen} = this.state;

    let thumbnailImagesPaths = images.map((image) => ({imageUrl: image.iconSizeImageUrl, imageName: productName}));
    let imageSizePropertyName = isShowBigSizeImages ? 'bigSizeImageUrl' : 'regularSizeImageUrl';
    let hasOutfitRecommendations = outfits && outfits.length > 0;
    let socialLinksClassName = hasOutfitRecommendations ? 'social-networks-align-right' : '';

    return (
      <div className="product-images-container">
        {!isMobile && <div className="preview-and-social-media-icons">
          {isThumbnailListVisible && (
            <ThumbnailsList images={thumbnailImagesPaths} selectedImageIndex={currentImageIndex}
              onThumbnailClick={this.handleThumbnailClick} />
          )}

          {/* TODO: replace with SocialMediaLinks renamed to ProductSocialMedia, and receiving it as a child of this component */}
          {isEnabledSocialMedia && <SocialMediaLinks isFbEnabled isPtEnabled isTwEnabled />}
        </div>}

        <div className="main-image-container">
          <Image imageUrl={images[currentImageIndex] && images[currentImageIndex][imageSizePropertyName]}
            zoomImageUrl={images[currentImageIndex] && images[currentImageIndex].superSizeImageUrl} imageName={productName}
            isZoomEnabled={isZoomEnabled} onOpenSimpleFullSize={this.handleShowFullSizeModalClick} isMobile={isMobile}
            className={isMobile ? 'principal-preview-image' : 'principal-preview-image-container'} imageClassName="principal-preview-image-content" enlargedImageContainerClassName="principal-preview-image-element" />

          <ImageCtas isFullSizeVisible={isFullSizeVisible} isSliderBarVisible={isMobile && (images.length > 1)}
            imageCount={images.length} currentImageIndex={currentImageIndex}
            onNextClick={this.handleNextImageClick}
            onPreviousClick={this.handlePreviousImageClick}
            onShowFullSizeClick={this.handleShowFullSizeModalClick} />

            {isFullSizeVisible && <button className="button-resize" aria-label="view full size image" onClick={this.handleShowFullSizeModalClick}>Full Size</button>}
        </div>

        {isMobile && hasOutfitRecommendations && <CompleteTheLookCTA imagePath={outfits[0] && outfits[0].imagePath} />}
        {isMobile && isEnabledSocialMedia && <SocialMediaLinks className={socialLinksClassName} isFbEnabled isPtEnabled isTwEnabled />}

        {isFullSizeModalOpen &&
          (isMobile
            ? <FullSizeImageModal name={productName}
                image={images[currentImageIndex] && images[currentImageIndex][imageSizePropertyName]}
                onCloseClick={this.handleCloseFullSizeModalClick} />
              : <FullSizeImageWithQuickViewModalContainer colorFormName={colorFormName} colorFieldName={colorFieldName}
                onCloseClick={this.handleCloseFullSizeModalClick} images={images}
                onColorChange={onColorChange} isThumbnailListVisible={isThumbnailListVisible} />
          )
        }
      </div>
    );
  }
}
