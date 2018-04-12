/** @module DisplayCard
 * @summary A component rendering a card, which is a simple non-blocking modal with close button, that renders its children.
 *
 * A card is like a modal in the sense that iot overlays on top of other elements (a className prop with
 * with a proper z-index is needed in order to achieve this), and it has a close button, but unlike a modal
 * it does not block the user's interaction with other elements on the page.
 * In addition, on mount, it renders a spinner until the onMount callback's promise resolves, at which time it
 * renders its children instead (in both cases a containing div with the given className is rendered).
 *
 * Note: if props.children is a string or a Rect-element, then it is rendered as ususal;
 * However, if it is a function, then that function return value(s) are rendered instead.
 * This is useful in case the children should not be evaluated until the onMount promise resolves (recall that
 * regular childrent elements are evaluated and then sent as a prop of their parent).
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';

// Note that this component is not necessarily pure (i.e. renders the same thing for the same prop values)
// since a props.children of type function can be used with it, and that the same function may render different
// things (e.g., if it is a bound method of a parent component, what it renders may change with the props of the parent
// and not of this component).
export class DisplayCard extends React.Component {
  static propsTypes = {
    /** The CSS class to use for the containing div of this Card */
    className: PropTypes.string,
    /** The CSS class to use for the close button of this Card */
    buttonClassName: PropTypes.string,
    /** The CSS class to use for error messages in this Card */
    errorClassName: PropTypes.string,

    /** The text to display in the close button for this Card. defaults to "Close" */
    submitButtonText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

    /**
     *  Callback for when the close button of this Card is clicked. Accepts the click event object
     * Note that this component does not maintain any state, and it is the responsibility of the parent component
     * to hide (i.e., not render) this Card when not needed.
     */
    onCloseClick: PropTypes.func.isRequired,

    /**
     * Optional callback to run on component mount (usually to populate redux store information consumened by this component).
     * Should return a promise. A spinner shows until the promise is resolved.
     * */
    onMount: PropTypes.func
  }

  static defaultProps = {
    onMount: Promise.resolve.bind(Promise),
    submitButtonText: 'Close'
  }

  constructor (props) {
    super(props);
    this.state = {isLoading: true};
    this.setError = getSetErrorInStateMethod(this);
  }

  componentDidMount () {
    this.props.onMount()
    .then(() => this.setState({isLoading: false}))
    .catch((err) => {
      this.setError(err);
      this.setState({isLoading: false});
    });
  }

  renderChildren () {
    let {children} = this.props;
    return (typeof children === 'function')
      ? children()
      : children;
  }

  render () {
    let {className, buttonClassName, errorClassName, submitButtonText, onCloseClick} = this.props;
    let {isLoading, error} = this.state;

    if (isLoading) { return <div className={className}><Spinner /></div>; }

    return (
      <div className={className}>
        {error
          ? <ErrorMessage error={error} className={errorClassName} />
          : this.renderChildren()
        }
        <button type="button" className={buttonClassName} onClick={onCloseClick}>{submitButtonText}</button>
      </div>
    );
  }
}
