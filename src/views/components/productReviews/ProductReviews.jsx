/** @module PDP - Product Reviews (BazaarVoice)
 * @summary BazaarVoice integration module
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {requireUrlScript} from 'util/resourceLoader';
import cssClassName from 'util/viewUtil/cssClassName';
import {bin2hex, md5} from 'util/encoding.js';

export class ProductReviews extends React.Component {
  static propTypes = {
    /** id of the product - for BV */
    ratingsProductId: PropTypes.string.isRequired,

    /** indicates the it's broqwser mode, I want it as prop to force a re-render on client */
    isClient: PropTypes.bool.isRequired,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    userId: PropTypes.string
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      isLoading: true,
      expanded: this.props.expanded
    };

    this.captureContainerRef = this.captureContainerRef.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.bindWriteReviewClick = this.bindWriteReviewClick.bind(this);
  }

  componentDidMount () {
    return requireUrlScript(this.props.bazaarvoiceApiUrl)
      .then(() => {
        this.setState({
          isLoading: false
        });
      });
  }

  bindWriteReviewClick () {
    let containerDivId = 'BVRRContainer-' + this.props.ratingsProductId;
    let summaryContainerDiv = 'BVRRSummaryContainer-' + this.props.ratingsProductId;

    let buttons = document.querySelectorAll(`#${containerDivId} button.bv-write-review, #${containerDivId} .bv-write-review-label, #${summaryContainerDiv} button.bv-write-review, #${summaryContainerDiv} .bv-write-review-label`);
    if (buttons.length > 0) {
      document.getElementById(containerDivId).removeEventListener('DOMSubtreeModified', this.bindWriteReviewClick);

      [].forEach.call(
      buttons, (button) => {
        button.addEventListener('click', this.handleLoginClick);
      });
    }
  }

  handleLoginClick (event) {
    if (this.props.isGuest) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onLoginClick();
      return false;
    }
  }

  captureContainerRef (ref) {
    this.containerRef = ref;

    let scope = 'rr';
    let action = 'show_reviews';
    let containerDivId = 'BVRRContainer-' + this.props.ratingsProductId;
    let options = {
      contentContainerDiv: containerDivId,
      productId: this.props.ratingsProductId,
      summaryContainerDiv: 'BVRRSummaryContainer-' + this.props.ratingsProductId
    };

    document.getElementById(containerDivId).addEventListener('DOMSubtreeModified', this.bindWriteReviewClick);

    if (window.$BV) {
      // NODE: this code was taken (as is) from TCP production
      if (!this.props.isGuest) {
        // define the sharedKey
        let sharedKey = 'Fca3yih00AVeVDFvmaDwnwlWM';

        // obtain current date in the format of yyyyMMdd
        let rightNow = new Date();
        let res = rightNow.toISOString().slice(0, 10).replace(/-/g, '');
        let queryString = 'date=' + res.toString() + '&userid=' + this.props.userId;

        // define unhashed security key
        let unhashed = (sharedKey.toString()).concat(queryString.toString());

        // obtain HEX representation of queryString
        let hexQueryString = bin2hex(queryString);

        // obtain MD5 hash of the unhashed security key
        // var hashed = CryptoJS.MD5(unhashed);
        let hashed = md5(unhashed);

        let securityToken = hashed.toString() + hexQueryString.toString();

        window.$BV.configure('global', {
          productId: this.props.ratingsProductId,
          userToken: securityToken.toString() });
      } else {
        window.$BV.configure('global', {
          productId: this.props.ratingsProductId
        });
      }

      window.$BV.ui(scope, action, options);
    }
  }

  handleToggle () {
    this.setState({ expanded: !this.state.expanded });
  }

  render () {
    let {expanded} = this.state;
    let {isMobile} = this.props;

    if (this.state.isLoading || !this.props.isClient) {
      return null;
    }

    let accordionClassName = cssClassName(
      'ratings-and-reviews-accordion ',
      {'accordion ': isMobile},
      {'accordion-expanded ': expanded}
    );

    return (
      <div className={accordionClassName}>
        {isMobile && <h4 className="accordion-button-toggle" onClick={isMobile ? this.handleToggle : null}>
          Ratings & Reviews
          <button className="accordion-toggle" title="Ratings & Reviews">Ratings & Reviews</button>
        </h4>}

        <div id={'BVRRContainer-' + this.props.ratingsProductId} ref={this.captureContainerRef} className="ratings-and-reviews-container"></div>
      </div>);
  }
}
