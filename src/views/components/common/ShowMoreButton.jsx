/** @module ShowMoreButton
 * @summary renders a button for showing more or less items in a list.
 * Support is also given for remembering the state (expanded or not) of the button,
 * And helping list renering components obtain the relevant slice of the list they should render.
 *
 *  TODO: document pushing down all extra props
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';

export class ShowMoreButton extends React.Component {
  static propTypes = {
    /** the css class name to use */
    className: PropTypes.string,
    /** the css class name to use in the expanded state */
    expandedClassName: PropTypes.string,

    /** text of button in non-expanded state */
    buttonText: PropTypes.string,
    /** text of button in expanded state */
    buttonExpandedText: PropTypes.string,
    /** text to make button accessible for screen readers */
    buttonAccessibleLabel: PropTypes.string,

    /** Maximum number of list elements to show when in the non-expanded state */
    shrinkedSize: PropTypes.number.isRequired,

    /** the number of elements available in the list */
    listLength: PropTypes.number.isRequired,

    /** flags whether to start in the expanded state */
    initiallyExpanded: PropTypes.bool,

    /** a callback for when the button is clicked.
     * accepts a parmeter that is true iff the click caused a move to the expanded state
     */
    onClick: PropTypes.func
  }

  static defaultProps = {
    buttonText: 'Show more',
    buttonExpandedText: 'Show less'
  }

  static getVisibleSlice (list, shrinkedSize, isExpanded) {
    return (list.length > shrinkedSize && !isExpanded) ? list.slice(0, shrinkedSize) : list;
  }

  constructor (props) {
    super(props);

    this.state = {expanded: props.initiallyExpanded};
    this.handleShowMoreToggle = this.handleShowMoreToggle.bind(this);
  }

  handleShowMoreToggle (event) {
    let expanded = !this.state.expanded;
    this.setState({expanded: expanded});
    if (this.props.onClick) {
      this.props.onClick(expanded);
    }
  }

  render () {
    let {className, expandedClassName, buttonText, buttonExpandedText, listLength, shrinkedSize, buttonAccessibleLabel,
      initiallyExpanded,       // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    if (listLength <= shrinkedSize) return null;    // do not render button if full list fits in shrinked size

    return (this.state.expanded)
      ? <button type="button" {...otherProps} onClick={this.handleShowMoreToggle} className={className} aria-label={`${buttonExpandedText} ${buttonAccessibleLabel}`}><u>{buttonExpandedText}</u></button>
      : <button type="button" {...otherProps} onClick={this.handleShowMoreToggle} className={expandedClassName || className} aria-label={`${buttonText} ${buttonAccessibleLabel}`}><u>{buttonText}</u></button>;
  }

}
