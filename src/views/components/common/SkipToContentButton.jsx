import React from 'react';
import {PropTypes} from 'prop-types';
import {isClient, isTouchClient} from 'routing/routingHelper';

require('./_skip-to-content-button.scss');

export class SkipToContentButton extends React.Component {
  static propTypes = {
    /** selector to the element that needs to retrieve focus when this button is clicked on */
    contentSelector: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);

    this.handleSkipToContent = this.handleSkipToContent.bind(this);
  }

  handleSkipToContent () {
    if (isClient() || isTouchClient()) {
      let firstElementOfMain = document.querySelector(this.props.contentSelector);
      if (firstElementOfMain) {
        firstElementOfMain.setAttribute('tabindex', '-1');
        firstElementOfMain.focus();
        window.scrollTo(0, 0);
      }
    }
  }

  render () {
    return (
      <button type="button" onClick={this.handleSkipToContent} className="skip-content-button" title="Skip to Content">Skip to Content</button>
    );
  }
}
