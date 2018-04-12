/**
 * @module Scroll To Top Button
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {isClient} from 'routing/routingHelper';
import cssClassName from 'util/viewUtil/cssClassName';

require('./_scroll-to-top-button.scss');

// const timer = null;

export class ScrollToTopButton extends React.Component {
  static propTypes = {
    /** callback to trigger on click of the button */
    onClick: PropTypes.func.isRequired,

    isMobile: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      isScrolling: false
    };

    this.handleScrollingList = this.handleScrollingList.bind(this);
    this.timer = null;
  }

  componentDidMount () {
    if (isClient()) {
      document.addEventListener('scroll', this.handleScrollingList, true);
      document.addEventListener('mousewheel', this.handleScrollingList, true);
      document.addEventListener('DOMMouseScroll', this.handleScrollingList, true);
    }
  }

  handleScrollingList () {
    if (!this.props.isMobile) {
      if (isClient()) {
        if (window.pageYOffset > 200) {
          this.setState({ isScrolling: true });
        } else {
          this.setState({ isScrolling: false });
        }
      }

      return;
    }

    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.setState({ isScrolling: false });
    }

    this.timer = setTimeout(() => {
      if (isClient()) {
        if (window.pageYOffset > 200) {
          this.setState({ isScrolling: true });
        } else {
          this.setState({ isScrolling: false });
        }
      }
    }, 150);
  }

  render () {
    let {isMobile, onClick, className} = this.props;
    className = cssClassName(
      className,
      ' scroll-to-top-container',
      {' active-scroll': this.state.isScrolling}
    );

    return <button type="button" className={className} onClick={onClick}>
      {!isMobile && <span className="scroll-to-top-message">Back to top</span>}
      <i className="scroll-to-top-icon">Top</i>
    </button>;
  }

}
