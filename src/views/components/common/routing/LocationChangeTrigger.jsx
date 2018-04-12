/** @module LocationChangeTrigger
 * @summary a component that calls a callbnack function whenever the location changes.
 *
 * Note: this component renders nothing.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {withRouter} from './withRouter';

class _LocationChangeTrigger extends React.Component {
  static propTypes = {
    /** Callback for when the location changes. Accepts the following parameters: match, location, history.
     * The values of these are determined by the closest enclousing Route component.
     */
    onLocationChange: PropTypes.func.isRequired,

    /** flags if to call the callback on component mount as well */
    triggerOnMount: PropTypes.bool,

    /** flags to ignore location changes if the location.pathname didn't change */
    isIgnoreChangesToSamePath: PropTypes.bool
  }

  componentWillMount () {
    if (this.props.triggerOnMount) {
      this.handleLocationChange(this.props);
    }
  }

  componentWillReceiveProps (nextProps) {
    // if (!shallowEqual(this.props, nextProps)) {
    if (this.props.location !== nextProps.location) {
      if (!nextProps.isIgnoreChangesToSamePath || this.props.location.pathname !== nextProps.location.pathname) {
        this.handleLocationChange(nextProps);
      }
    }
  }

  shouldComponentUpdate () {
    return true;
  }

  render () {
    return null;
  }

  handleLocationChange (props) {
    let {match, location, history, onLocationChange} = props;
    onLocationChange(match, location, history);
  }
}

export const LocationChangeTrigger = withRouter(_LocationChangeTrigger);
LocationChangeTrigger.displayName = 'LocationChangeTrigger';
