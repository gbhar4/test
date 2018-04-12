/** @module DrawerFooter
 * A presentational component rendering a footer for various forms with a "create-account"
 * button and and espot.
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {DRAWER_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

if (DESKTOP) { // eslint-disable-line no-undef
  require('./_d.drawer-footer.scss');
} else {
  require('./_m.drawer-footer.scss');
}

export class DrawerFooter extends React.Component {

  static propTypes= {
    /** Flags if the create-account button should be hidden */
    isHideCreateAccountButton: PropTypes.bool,
    /** Flags if the espot should be hidden */
    isHideESpot: PropTypes.bool,

    /** a callback for opening a selected drawer given its id (as per DRAWER_IDS) */
    openSelectedDrawer: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.handleCreateAccountClick = () =>
      this.props.openSelectedDrawer(DRAWER_IDS.CREATE_ACCOUNT);
  }

  render () {
    let {isHideCreateAccountButton, isCountryUS} = this.props;

    return (
      <div className="new-account">
        {!isHideCreateAccountButton && [
          <span key="1">Don&apos;t have an account? Create one now {isCountryUS ? 'to start earning points' : 'for faster checkout'}!</span>,
          <button key="2" type="button" className="button-secondary button-create-account"
            onClick={this.handleCreateAccountClick}>CREATE ACCOUNT</button>
        ]}
      </div>
    );
  }

}
