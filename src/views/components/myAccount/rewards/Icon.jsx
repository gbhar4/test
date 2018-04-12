/**
 * @module Icon
 * Reward, Plcc or Saving icon.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

class Icon extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired
  }

  render () {
    let {title, src} = this.props;
    let type = src.split('-');
    type = type[0];

    return (
      <figure className={'uncondense-image-coupon ' + type + '-type'}>
        <div className="uncondense-icon-container">
          <div className="uncondense-information-coupon">
            <img src={'/wcsstore/static/images/' + src} alt={title} />
            <strong className="coupon-value">{title}</strong>
          </div>
        </div>
      </figure>
    );
  }
}

export {Icon};
