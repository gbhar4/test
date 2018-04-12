/** @module MyAccountHelloMessage
 * @summary Component with message of welcome at the user.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.hello-message.scss');
} else {
  require('./_m.hello-message.scss');
}

class MyAccountHelloMessage extends React.Component {
  static propTypes = {
    /** User's first name. */
    firstName: PropTypes.string.isRequired,

    /** Flag to know if the country does not allow rewards. */
    isRewardsEnabled: PropTypes.bool
  }

  render () {
    let {firstName, isRewardsEnabled} = this.props;
    let helloMessageClassName = !isRewardsEnabled ? 'hello-message-for-no-rewards' : 'hello-message-container';

    if (isRewardsEnabled) {
      firstName = (firstName || '').trim();
      firstName = firstName && (firstName.length > 10)
        ? firstName.substr(0, 8) + '...'
        : firstName + '!';
    } else {
      firstName = firstName + '!';
    }

    return (
      <section className={helloMessageClassName}>
        <strong className="hello-title">Hi {firstName}</strong>
      </section>
    );
  }

}

export {MyAccountHelloMessage};
