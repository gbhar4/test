/** @module GlobalHeaderDrawerOpener
 * @summary a non-visual component (i.e., renders null) that on mount (and prop-change) opens a requested drawer in the global header (e.g., login drawer)
 *
 *  @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {DRAWER_IDS, LOGIN_FORM_TYPES} from 'reduxStore/storeReducersAndActions/globalComponents/globalComponents';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

class _GlobalHeaderDrawerOpener extends React.Component {
  static propTypes = {
    drawerId: PropTypes.oneOf(Object.keys(DRAWER_IDS).map((key) => DRAWER_IDS[key])).isRequired,
    formId: PropTypes.oneOf(Object.keys(LOGIN_FORM_TYPES).map((key) => LOGIN_FORM_TYPES[key]))
  }

  componentWillMount () {
    this.props.openSelectedDrawer(this.props.drawerId);
    if (this.props.formId) {
      this.props.openSelectedForm(this.props.formId);
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.drawerId !== nextProps.drawerId) {
      this.props.openSelectedDrawer(nextProps.drawerId);

      if (nextProps.formId) {
        this.props.openSelectedForm(nextProps.formId);
      }
    }
  }

  render () {
    return null;
  }
}

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    openSelectedDrawer: storeOperators.globalSignalsOperator.openSelectedDrawer,
    openSelectedForm: storeOperators.globalSignalsOperator.openSelectedLoginDrawerForm
  };
}

let GlobalHeaderDrawerOpener = connectPlusStoreOperators(
  {globalSignalsOperator: getGlobalSignalsOperator}, mapStateToProps
)(_GlobalHeaderDrawerOpener);
GlobalHeaderDrawerOpener.displayName = 'GlobalHeaderDrawerOpener';

export {GlobalHeaderDrawerOpener};
