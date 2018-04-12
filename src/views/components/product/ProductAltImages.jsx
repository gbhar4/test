/**
 * @module ProductAltImages
 *
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import LazyLoad from 'react-lazy-load';

export class ProductAltImages extends React.Component {
  static propTypes = {
    /** callback for when the shown image changes. Accepts: image index */
    onImageChange: PropTypes.func,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    productName: PropTypes.string.isRequired,
    pdpUrl: PropTypes.string.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.state = {currentIndex: 0};

    this.handlePrevImage = this.handlePrevImage.bind(this);
    this.handleNextImage = this.handleNextImage.bind(this);
  }

  handlePrevImage () {
    let idx = this.state.currentIndex - 1;
    if (idx < 0) {
      idx += this.props.imageUrls.length;
    }
    this.setState({currentIndex: idx});
    this.props.onImageChange && this.props.onImageChange(idx);
  }

  handleNextImage () {
    let idx = (this.state.currentIndex + 1) % this.props.imageUrls.length;
    this.setState({currentIndex: idx});
    this.props.onImageChange && this.props.onImageChange(idx);
  }

  render () {
    let {imageUrls, pdpUrl, productName} = this.props;
    let {currentIndex} = this.state;

    return (<figure className="product-image-container" itemScope itemType="http://schema.org/ImageObject">
      <button type="button" className="button-prev" onClick={this.handlePrevImage}>prev</button>
      <a href={pdpUrl} title={productName}>
        <LazyLoad offsetVertical={2000}>
          <img className="product-image-content img-item" src={imageUrls[currentIndex]} alt={productName} itemProp="contentUrl" />
        </LazyLoad>
      </a>
      <button type="button" className="button-next" onClick={this.handleNextImage}>next</button>
    </figure>);
  }
}
