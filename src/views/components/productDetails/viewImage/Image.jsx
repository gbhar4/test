/** @module Image.
 * @summary Small component that contains an image that will be the principal one in show.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import ReactImageMagnify from 'react-image-magnify';

class Image extends React.Component {
  static propTypes = {
    /** the image name or title */
    imageName: PropTypes.string,

    /** the image url */
    imageUrl: PropTypes.string.isRequired,

    /** zoom image url */
    zoomImageUrl: PropTypes.string.isRequired,

    /** Flags if the zoom should be enabled */
    isZoomEnabled: PropTypes.bool.isRequired,

    /** Func to open simple fullsize image modal (Only Mobile) */
    onOpenSimpleFullSize: PropTypes.func,

    className: PropTypes.string
  }

  render () {
    let {isMobile, imageName, imageUrl, zoomImageUrl, isZoomEnabled, onOpenSimpleFullSize, className} = this.props;
    let isSimpleModalEnabled = isMobile;

    return (
      <div itemScope itemType="http://schema.org/ImageObject" className={className} title={!isZoomEnabled ? imageName : ''}> {/* NOTE: In production, when zoom is enabled, don't show the name in hover state */}
        {isZoomEnabled ? (
          <ReactImageMagnify {...{
            smallImage: {
              src: imageUrl,
              isFluidWidth: true
            },
            largeImage: {
              src: zoomImageUrl,
              width: 900,
              height: 900
            },
            enlargedImagePosition: isMobile ? 'over' : 'beside',
            fadeDurationInMs: 300,
            hoverDelayInMs: 250,
            hoverOffDelayInMs: 150,
            /* TODO: replace with enlargedImageContainerClassName
              NOTE: I couldn't fix it from the styles, for now I leave it here. */
            enlargedImageContainerStyle: {
              zIndex: 100
            },
            isActivatedOnTouch: isMobile
          }} />
        ) : isSimpleModalEnabled
            ? <button onClick={onOpenSimpleFullSize}><img src={imageUrl} alt={imageName} itemProp="contentUrl" /></button>
            : <img src={imageUrl} alt={imageName} itemProp="contentUrl" />
        }
      </div>
    );
  }
}

export {Image};
