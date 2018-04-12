/**
 * @module HeaderGlobalSticky
 * @author Agu
 * Component to listen for scroll and make the header sticky
 */

import React from 'react';
import cssClassName from 'util/viewUtil/cssClassName';
import {findElementPosition} from 'util/viewUtil/findElementPosition.js';
import {isClient} from 'routing/routingHelper';

import {HeaderGlobalMobileContainer} from 'views/components/globalElements/HeaderGlobalMobileContainer.js';
import {HeaderGlobalWithNavigation} from 'views/components/globalElements/HeaderGlobalWithNavigation.jsx';

export class HeaderGlobalSticky extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isSticky: false,
      headerPosition: 0
    };

    this.handleStickyHeader = this.handleStickyHeader.bind(this);
    this.saveHeaderRef = this.saveHeaderRef.bind(this);
  }

  componentDidMount () {
    if (isClient()) {
      document.addEventListener('scroll', this.handleStickyHeader, true);
      document.addEventListener('mousewheel', this.handleStickyHeader, true);
      document.addEventListener('DOMMouseScroll', this.handleStickyHeader, true);
    }
  }

  componentWillUnmount () {
    if (isClient()) {
      document.removeEventListener('scroll', this.handleStickyHeader, true);
      document.removeEventListener('mousewheel', this.handleStickyHeader, true);
      document.removeEventListener('DOMMouseScroll', this.handleStickyHeader, true);
    }
  }

  saveHeaderRef (elem) {
    this.headerElement = elem;
  }

  handleStickyHeader (event) {
    let scrollPosition = 0;

    if (isClient()) {
      scrollPosition = window.pageYOffset;
    }

    if (!this.state.isSticky) {
      this.setState({
        isSticky: this.state.isSticky,
        headerPosition: findElementPosition(this.headerElement)
      });
    }

    if (scrollPosition > this.state.headerPosition.top) {
      // make sticky
      this.setState({
        isSticky: true,
        headerPosition: this.state.headerPosition
      });
    } else if (this.state.isSticky) {
      // remove sticky
      this.setState({
        isSticky: false,
        headerPosition: this.state.headerPosition
      });
    }
  }

  render () {
    let {isSticky} = this.state;
    let {isMobile} = this.props;
    let containerClassName = cssClassName(
      {'header-sticky ': isSticky}
    );

    return (isMobile
      ? <HeaderGlobalMobileContainer stickyClassName={containerClassName} onStoreStickyRef={this.saveHeaderRef} />
      : <HeaderGlobalWithNavigation stickyClassName={containerClassName} onStoreStickyRef={this.saveHeaderRef} />
    );
  }

}
