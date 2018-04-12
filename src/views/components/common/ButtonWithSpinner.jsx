/** module ButtonWithSpinner
 * @summary A React component rendering a button tailored for async. onClick event hadlers that return a promise: the button
 * disables itself and shows a spinner until the promise resolves.
 *
 * Any extra props (i.e., other than <code>onClick, spinnerClassName</code>) passed to this component will be passed along to the rendered <code>button</code> element.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CustomSpinnerIcon} from 'views/components/common/Spinner.jsx';
import {getCancellablePromise, PROMISE_CANCELLED} from 'util/cancellablePromise';

export class ButtonWithSpinner extends React.Component {

  static propTypes = {
    /** optional className to use for the spinner */
    spinnerClassName: PropTypes.string,
    /**
     *  A callback for click on this button. accepts: the click event;
     * If it returns a promise then a spinner will show until it resolves.
     **/
    onClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {showSpinner: false};
    this.onDismnountCallback = null;

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentWillUnmount () {
    if (this.onDismnountCallback) {
      this.onDismnountCallback();     // cancel the spinner controlling promise
    }
  }

  handleOnClick (event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({showSpinner: true});

    // create a promise that resolves to the returned promise from onClick, or to its regular return value
    let onClickPromise = Promise.resolve(this.props.onClick(event));

    getCancellablePromise(onClickPromise, (cancel) => { this.onDismnountCallback = cancel; })
    .then(() => this.setState({showSpinner: false}))
    .catch((reason) => reason !== PROMISE_CANCELLED && this.setState({showSpinner: false}));

    return onClickPromise;
  }

  render () {
    let {
      onClick,     // eslint-disable-line no-unused-vars
      spinnerClassName, isEnabledClick, ...otherProps} = this.props;

    return (
      this.state.showSpinner
        ? <span className={`${spinnerClassName}-container`}>
            <CustomSpinnerIcon className={spinnerClassName} />
          </span>
        : <button onClick={this.handleOnClick} {...otherProps} />
    );
  }

}
