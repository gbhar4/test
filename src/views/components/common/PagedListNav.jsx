/** @module PagedListNav
 * @summary Kind-of carousel to navigate the pages of a list.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('views/components/sliderBar/_d.slider-bar.scss');
} else {
  require('views/components/sliderBar/_m.slider-bar.scss');
}

class PagedListNav extends React.Component {
  static propTypes = {
    /** number of the current page (one-based) */
    currentPage: PropTypes.number.isRequired,
    /** total number of pages */
    totalNumberOfPages: PropTypes.number.isRequired,
    /**
     * Limits the number of page numbers to show at the same time. Defaults to
     * 4.
     */
    numberOfPagesToShow: PropTypes.number,
    /**
     * callback to handle request to view a certain page of the list. It should
     * accept a single parameter that is the page number (one-based).
     */
    onGoToPage: PropTypes.func.isRequired
  }

  static defaultProps = {
    numberOfPagesToShow: 4
  }

  constructor (props) {
    super(props);
    this.state = {firstPage: 1};
    this.handleGoToPreviousPageSet = this.handleGoToPreviousPageSet.bind(this);
    this.handleGoToNextPageSet = this.handleGoToNextPageSet.bind(this);
  }

  handleGoToPage (e, pageNumber) {
    return this.props.onGoToPage(pageNumber);
  }

  handleGoToPreviousPageSet () {
    let {numberOfPagesToShow} = this.props;
    let {firstPage} = this.state;
    let targetPageNumber = firstPage - numberOfPagesToShow;
    if (targetPageNumber < 1) {
      targetPageNumber = 1;
    }
    this.setState({firstPage: targetPageNumber});
    this.props.onGoToPage(targetPageNumber);
  }

  handleGoToNextPageSet () {
    let {numberOfPagesToShow} = this.props;
    let {firstPage} = this.state;
    let targetPageNumber = firstPage + numberOfPagesToShow;
    this.setState({firstPage: targetPageNumber});
    this.props.onGoToPage(targetPageNumber);
  }

  render () {
    let {currentPage, totalNumberOfPages, numberOfPagesToShow} = this.props;
    let {firstPage} = this.state;
    let currentPageSetSize = numberOfPagesToShow;
    if (firstPage + numberOfPagesToShow > totalNumberOfPages) {
      currentPageSetSize = totalNumberOfPages - firstPage + 1;
    }
    let pageNumbers = Array(currentPageSetSize).fill(0).map((e, index) => index + firstPage);
    let lastPage = pageNumbers[pageNumbers.length - 1];

    if (totalNumberOfPages <= 1) {
      return null;
    }

    return (
      <nav className="navigation-carrousel-container">
        {firstPage > 1 && <button className="button-carrousel-prev" onClick={this.handleGoToPreviousPageSet}></button>}
        {pageNumbers.map((page) => {
          let className = cssClassName('navigation-carrousel-item number-navigation ',
            {'item-active': page === currentPage});
          return <button key={page} className={className} onClick={(e) => this.handleGoToPage(e, page)}>{page}</button>;
        })}
        {lastPage < totalNumberOfPages && <button className="button-carrousel-next" onClick={this.handleGoToNextPageSet}></button>}
      </nav>
    );
  }
}

export {PagedListNav};
