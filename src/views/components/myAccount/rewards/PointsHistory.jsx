/**
 * @module PointsHistory
 * Shows a list of points transactions with pagination in my account.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

import {HeaderContainer} from './HeaderContainer.js';
import {PointsTransactionsList} from './PointsTransactionsList.jsx';
import {PagedListNav} from 'views/components/common/PagedListNav.jsx';
import {FooterQuestions} from './FooterQuestions.jsx';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./menu/pointsAndHistory/_d.points-history-section.scss');
} else {
  require('./menu/pointsAndHistory/_m.points-history-section.scss');
}

class PointsHistory extends React.Component {
  static propTypes = {
    /**
     * array with one element for each page. Each element is itself and array
     * of the point transactions in the page.
     */
    pointsTransactionsPages: PropTypes.array.isRequired,
    /** total number of points transaction pages */
    totalNumberOfPages: PropTypes.number.isRequired,
    /**
     * callback to handle request to view a certain page of the list. It should
     * accept a single parameter that is the page number (one-based).
     */
    onGoToPage: PropTypes.func.isRequired,
    /** merge page nav propTypes */
    ...PagedListNav.propTypes,
    isMobile: PropTypes.bool.isRequired,
    /** message to show because of successfull operations */
    successMessage: PropTypes.string,
    /** message to show for some errors that can only be managed by help desk */
    errorMessage: PropTypes.string,
    /** callback to clear the success message */
    onClearFlashMessage: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {currentPage: 1};
    this.handleGoToPage = this.handleGoToPage.bind(this);
    this.clearFlashMessage = this.clearFlashMessage.bind(this);
  }

  clearFlashMessage () {
    this.props.onClearFlashMessage();
  }

  handleGoToPage (pageNumber) {
    this.clearFlashMessage();
    this.props.onGoToPage(pageNumber).then(() => {
      this.setState({currentPage: pageNumber});
    });
  }

  render () {
    let {pointsTransactionsPages, totalNumberOfPages, isMobile, successMessage,
      errorMessage} = this.props;
    let {currentPage} = this.state;
    let currentPagePoints = pointsTransactionsPages[currentPage - 1];
    let hasPointsHistory = totalNumberOfPages > 0 && currentPagePoints &&
      currentPagePoints.length > 0;

    return (
      <div className="points-history-section">
        <HeaderContainer />
        {successMessage && <SuccessMessage message={successMessage} />}
        {errorMessage && <ErrorMessage error={errorMessage} />}

        {hasPointsHistory
          ? <div className="points-summary-list-container">
              {isMobile && <PagedListNav {...{currentPage, totalNumberOfPages}}
                onGoToPage={this.handleGoToPage} />}
            <PointsTransactionsList pointsTransactionsList={currentPagePoints} isMobile={isMobile} />
            <PagedListNav {...{currentPage, totalNumberOfPages}}
              onGoToPage={this.handleGoToPage} />
          </div>
          : <p className="empty-points-history">Uh oh...you currently do not have any points. Start shopping now to begin earning points.</p>
        }

        <FooterQuestions isMobile={isMobile} />
      </div>
    );
  }
}

export {PointsHistory};
