/**
/** @module SlideBar
 * @summary Component that display the navigation bar for any slider or pages list.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.slider-bar.scss');
} else {
  require('./_m.slider-bar.scss');
}

export const NUMBER = 'number';
export const BULLET = 'bullet';

export class SliderBar extends React.Component {
  static propTypes = {
    /** The CSS class to use for the title text */
    className: PropTypes.string,

    /* Type of slide bar: number or bullet items */
    type: PropTypes.oneOf([NUMBER, BULLET]).isRequired,

    /* Quantity of pages to display */
    qtyPages: PropTypes.number.isRequired,

    /* Flag to know what pages is selected */
    selectedItem: PropTypes.number.isRequired
  }

  render () {
    let {className, type, selectedItem, qtyPages} = this.props;

    let containerSliderBar = cssClassName('navigation-carrousel-container ', className);

    let itemSliderBar = cssClassName('navigation-carrousel-item ',
    {'bullet-navigation ': type === BULLET},
    {'number-navigation ': type === NUMBER});

    let pages = [];

    for (let i = 0; i < qtyPages; i++) {
      let classNameItemActive = '';

      if (selectedItem === i) {
        classNameItemActive = ' item-active';
      }

      pages.push(
        <button key={i + 1} id={i + 1} className={itemSliderBar + classNameItemActive}>{type === NUMBER && (i + 1)}</button>
      );
    }

    return (
      <nav className={containerSliderBar}>
        {/* (qtyPages >= 4) && <button className="button-carrousel-prev" onClick={''}></button> */}

        {pages}

        {/* (qtyPages >= 4) && <button className="button-carrousel-next" onClick={''}></button> */}
      </nav>
    );
  }
}
