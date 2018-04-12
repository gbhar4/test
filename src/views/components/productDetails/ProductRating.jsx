/** @module ProductRating
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

export class ProductRating extends React.Component {
  static propTypes = {
    /* The id of the product (to initialize BV) */
    ratingsProductId: PropTypes.string.isRequired

    /* Rating of the product (float number between 0 and 5). */
    // rating: PropTypes.number.isRequired
  }

  render () {
    let {ratingsProductId} = this.props;

    return (
      <div id={'BVRRSummaryContainer-' + ratingsProductId} className="ranking-container">
        {/*
        <aside className="ranking-bar" style={{fontSize: 0, width: `${rating / 5 * 100}%`}}>Rating</aside>
        <img className="icons-image" src="/wcsstore/static/images/tcp-ranking-star.png" title="icon-stars" />
        */}
      </div>
    );
  }
}
