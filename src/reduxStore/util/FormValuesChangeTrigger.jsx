/** @module FormValuesChangeTrigger
 * An invisible AdaptiveFormPart that tracks changes in values of a redux-form's fields.
 * This component triggers a callback whenever the fields it tracks change.
 *
 *  @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import shallowEqual from 'util/shallowEqual';

const VISIBLE_PROP_TYPES = {
  /**
   * An optional callback to call whenever any of the tracked form fields changes.
   * It accepts three parameter: values, state, and an optional syncValidityInfo (see includeValidityInfo below).
   * @see getAdaptiveFormPart.propTypes.mapValuesToProps for more info on these parameters.
   */
  onChange: PropTypes.func,

  /** Flags not to trigger the call to onChange when this component mounts */
  doNotTriggerOnMount: PropTypes.bool
};

class _FormValuesChangeTrigger extends React.Component {

  static propTypes = {
    values: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    syncValidityInfo: PropTypes.objectOf(PropTypes.bool),
    ...VISIBLE_PROP_TYPES
  }

  static handleChange (props) {
    let {onChange, values, state, syncValidityInfo} = props;
    if (onChange) {
      onChange(values, state, syncValidityInfo);
    }
  }

  componentWillMount () {
    if (!this.props.doNotTriggerOnMount) {
      _FormValuesChangeTrigger.handleChange(this.props);
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(this.props, nextProps)) {
      _FormValuesChangeTrigger.handleChange(nextProps);
    }
  }

  shouldComponentUpdate () {
    return false;
  }

  render () {
    return null;
  }

}

let FormValuesChangeTrigger = getAdaptiveFormPart(_FormValuesChangeTrigger, '');
FormValuesChangeTrigger.defaultProps = {
  mapValuesToProps: (values, state, syncValidityInfo) => ({values, state, syncValidityInfo})
};
FormValuesChangeTrigger.propTypes = {...FormValuesChangeTrigger.propTypes, ...VISIBLE_PROP_TYPES};

export {FormValuesChangeTrigger};
