/**
 * @module Internation Checkout Form
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {requireUrlScript} from 'util/resourceLoader';

require('./_m.intl-checkout.scss');

export class InternationalCheckout extends React.PureComponent {
  static propTypes = {
    /** url of the js file controlling communication between iframe and outside */
    apiUrl: PropTypes.string.isRequired,

    /** url of the communication iframe */
    communicationUrl: PropTypes.string.isRequired,

    /** international checkout iframe url */
    iframeUrl: PropTypes.string.isRequired
  }

  componentDidMount () {
    // create form and submit
    requireUrlScript(this.props.apiUrl);
  }

  render () {
    let {iframeUrl, communicationUrl} = this.props;

    return (<div className="borders-free-container">
      <iframe id="__frame" width="0" height="0" frameborder="0" src={communicationUrl}></iframe>
      <iframe name="envoy" id="envoyId" src={iframeUrl} frameBorder="0" scrolling="no"></iframe>
    </div>);
  }
}
