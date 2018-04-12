/**
 * @module CompleteTheLookCTA
 * @author Carla Crandall <carla.crandall@sapientrazorfish.com>
 * CTA button for outfit recommendations
 * Mobile PDP only
 *
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {scrollToFirstMatchingElement} from 'util/viewUtil/scrollingAndFocusing';

require('./_m.complete-the-look-cta.scss');

export class CompleteTheLookCTA extends React.Component {

  static propTypes = {
    imagePath: PropTypes.string
  }

  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    // Scroll to element with selector [data-anchor="mobile-product-recommendations"]
    scrollToFirstMatchingElement('class', 'recommendations-and-outfit-container');
  }

  render () {
    let {imagePath} = this.props;

    return (
      <button className="complete-the-look-cta" onClick={this.handleClick}>
        <img src={imagePath} alt="" />
        <span>Complete The Look</span>
      </button>
    );
  }
}
