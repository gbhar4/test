/**
 * @module StickyNotification
 * @author Carla Crandall <carla.crandall@sapientrazorfish.com>
 * Generic otification confirming that an action has been completed.
 *
 * Usage:
 *  var StickyNotification = require("./StickyNotification.jsx");
 *
 *  <StickyNotification message=[string] />
 *
 * Component Props description/enumeration:
 *  @param {string} message: message for the notification.
 *  @param {string} className: custom class for the notification container
 *  @param {string} childClassName: custom class for the child div
 *  @param {boolean} handleScroll: boolean determines whether to listen to scroll event
 *  -
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {findElementPosition} from 'util/viewUtil/findElementPosition.js';
import {isClient} from 'routing/routingHelper';

if (DESKTOP) { // eslint-disable-line
  require('./_d.sticky-notification.scss');
} else {
  require('./_m.sticky-notification.scss');
}

export class StickyNotification extends React.Component {
  static propTypes = {
    message: PropTypes.string,
    handleScroll: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.state = {
      isSticky: false
    };

    this.handleStickyNotification = this.handleStickyNotification.bind(this);
    this.saveNotificationRef = this.saveNotificationRef.bind(this);
  }

  componentDidMount () {
    if (isClient() && this.props.handleScroll) {
            // Handle sticky notification logic when user is already scrolled past the notification position
      this.handleStickyNotification();

      document.addEventListener('scroll', this.handleStickyNotification, true);
      document.addEventListener('mousewheel', this.handleStickyNotification, true);
      document.addEventListener('DOMMouseScroll', this.handleStickyNotification, true);
    }
  }

  componentWillUnmount () {
    if (isClient() && this.props.handleScroll) {
      document.removeEventListener('scroll', this.handleStickyNotification, true);
      document.removeEventListener('mousewheel', this.handleStickyNotification, true);
      document.removeEventListener('DOMMouseScroll', this.handleStickyNotification, true);
    }
  }

  saveNotificationRef (elem) {
    this.notificationElement = elem;
  }

  handleStickyNotification (event) {
    if (!this.notificationElement) {
      // nothing to make sticky
      return;
    }

    let scrollPosition = 0;

    if (isClient()) {
      scrollPosition = window.pageYOffset;
    }

    let notificationPosition = findElementPosition(this.notificationElement);
    let shouldStick = scrollPosition > (notificationPosition.top - 100);

    if (this.state.isSticky !== shouldStick) {
      this.setState({
        isSticky: shouldStick
      });
    }
  }

  render () {
    let { message, className, childClassName, isCloseEnabled, handleCloseNotification } = this.props;
    let containerClassName = cssClassName(
            'notification ',
            {'notification-fixed ': this.state.isSticky},
            className || 'generic-sticky-notification'
        );

    if (!message) {
      return null;
    }

    return (
            <div className={containerClassName} ref={this.saveNotificationRef}>
                <div className={childClassName || 'notification-inline'}>
                {isCloseEnabled && <button className="button-notification-close" aria-label="close this modal" onClick={handleCloseNotification}>X</button>}
                    <p>
                        {message}
                    </p>
                </div>
            </div>
    );
  }
}
