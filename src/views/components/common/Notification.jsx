import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.notifications.scss');
} else {
  require('./_m.notifications.scss');
}

export class Notification extends React.Component {
  static propTypes = {
    /* Name of container class if needed */
    className: PropTypes.string,

    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),

    isUnavailable: PropTypes.bool,

    message: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  }

  render () {
    let {className, children, isUnavailable, summary, message} = this.props;
    className = className || '';
    let notificationClassName = cssClassName(
      'notification-inline ',
      {'notification-unavailable ': isUnavailable}
    );

    return (
      <div className={'notification ' + className}>
        {children && children}

        {summary && <span>{message}</span>}

        {message && <div className={notificationClassName}>
          <p>{message}</p>
        </div>
        }
      </div>
    );
  }
}
