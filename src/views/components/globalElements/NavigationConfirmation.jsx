/**
* @module NavigationConfirmation
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Tooltip to show a redirect navigation
* Usage:
*  var NavigationConfirmation = require("./NavigationConfirmation.jsx");
*
* @example
* <code>
*   <NavigationConfirmation message=[string] confirm=[string] cancel=[string] />
* </code>
*
* Component Props description/enumeration:
*  @param {string} message: the message to show when the tooltip is opened (example: "you are about to leave checkout. are you sure?")
*  @param {string} confirm: the message to show on the confirm cta (example: "yes, leave checkout")
*  @param {string} cancel: the message to show on the cancel cta (example: "no, stay on checkout")
*
* Style (ClassName) Elements description/enumeration
*  navigation-confirmation
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import ReactDOM from 'react-dom';
import {closestOfType} from 'util/viewUtil/closestOfType.js';
import {isAncestorOf} from 'util/viewUtil/isAncestorOf.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.navigation-confirmation.scss');
} else {
  require('./_m.navigation-confirmation.scss');
}

class NavigationConfirmation extends React.Component {
  static propTypes = {
    /** The message to display on the notification. */
    message: PropTypes.string.isRequired,

    /** The message to show on the confirm cta */
    confirm: PropTypes.string.isRequired,

    /** The message to show on the cancel cta */
    cancel: PropTypes.string.isRequired,

    /** optional confirmation callback: usually used to override the navigation attempt that triggered
     * this confirmation dialog and redirect to some other fixed url instead.
     */
    onConfirmClick: PropTypes.func
  }

  constructor (props) {
    super(props);

    this.state = {
      expanded: false,
      target: null
    };

    this.handleGlobalRedirect = this.handleGlobalRedirect.bind(this);
    this.handleConfirmationLocation = this.handleConfirmationLocation.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.captureContainerDivRef = this.captureContainerDivRef.bind(this);
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleConfirmationLocation, true);
    document.addEventListener('keyup', this.handleGlobalRedirect, true);
    document.addEventListener('click', this.handleGlobalRedirect, true);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleConfirmationLocation, true);
    document.removeEventListener('keyup', this.handleGlobalRedirect, true);
    document.removeEventListener('click', this.handleGlobalRedirect, true);
  }

  handleGlobalRedirect (event) {
    let anchor = closestOfType(event.target, 'A');

    // commenting out because everything is href='#' still
    // let href = anchor && (e.target.attributes['href'] || '').nodeValue;
    // if (anchor && href && href.substr(0,1) != "#" && (!e.keyCode || e.keyCode === 13)) {

    if (anchor && (!event.keyCode || event.keyCode === 13) && (!anchor.attributes['target'] || anchor.attributes['target'].value !== '_blank')) {
      event.preventDefault();

      this.setState({expanded: true, target: anchor, position: null, iconPosition: null});
      this.handleConfirmationLocation();
    } else {
      if (this.state.expanded && !isAncestorOf(this.containerDivRef, event.target)) {
        this.handleCancelClick();
      }
    }
  }

  handleConfirmationLocation () {
    if (!this.state.expanded) {
      return;
    }

    let target = this.state.target;

    let domContainer = ReactDOM.findDOMNode(this);
    let targetRect = target.getBoundingClientRect();
    let confirmationRect = domContainer.getBoundingClientRect();
    let left = targetRect.left - confirmationRect.width / 2;
    let right = 'auto';
    let iconLeft = confirmationRect.width / 2;

    if (left < 0) {
      left = '0px';
      iconLeft = targetRect.left + targetRect.width / 2;
    } else if (left + confirmationRect.width > window.innerWidth) {
      left = 'auto';
      right = '0px';
      iconLeft = targetRect.left + targetRect.width / 2 - window.innerWidth + confirmationRect.width;
    } else {
      iconLeft = targetRect.left + targetRect.width / 2 - left;
      left = left + 'px';
    }

    this.setState({
      expanded: true,
      target: target,
      position: {
        left: left,
        right: right,
        top: ((window.scrollY || 0) + targetRect.top + targetRect.height) + 'px'
      },
      iconPosition: {
        left: iconLeft + 'px'
      }
    });
  }

  handleCancelClick () {
    this.setState({expanded: false, target: null});
  }

  handleConfirmClick (event) {
    if (this.props.onConfirmClick) {
      this.props.onConfirmClick(event);
    } else {
      document.location = this.state.target.href;
    }
  }

  captureContainerDivRef (ref) {
    this.containerDivRef = ref;
  }

  render () {
    let {message, confirm, cancel} = this.props;
    let {expanded, position, iconPosition} = this.state;

    if (!expanded) {
      return null;
    }

    return (
      <div ref={this.captureContainerDivRef} className="navigation-confirmation expanded" style={position}>
        <i className="icon-arrow" aria-hidden="true" style={iconPosition}></i>
        <span>{message}</span>
        <button className="button-quaternary button-stay" onClick={this.handleCancelClick}>{cancel}</button>
        <button className="button-quaternary button-return" onClick={this.handleConfirmClick}>{confirm}</button>
      </div>
    );
  }
}

export {NavigationConfirmation};
