/** @module SelectItem
 * @summary A React component rendering one item inside a {@linkcode module:CustomSelect} dropdown
 *
 * Note that components of this class are pure. I.e., they render only if their props change.
 * The main reason this component exists is <strong>not</strong> to offload the rendering from <code>CustomSelect</code>;
 * rather, it is to prevent unnecessary re-rendering of items in the dropdown is performed.
 * In particular, it allows us to use the exact same event handlers for all the items in the list, thus avoiding the mistake of
 * calculating the event handler of each element inside the <code>render()</code> method of <code>CustomSelect</code>
 * (e.g., <code>onClick={() => handleOnClick(index)}</code>) as this would cause all items to re-render on any change
 * (such as moving the highlight).
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import shallowEqual from 'util/shallowEqual';

export class SelectItem extends React.PureComponent {
  static propTypes = {
    /** the className attribute to use when rendering this component */
    className: PropTypes.string.isRequired,

    /** the index of this element in the array (itemsMap) of the items in the dropdown (used for the callback {@linkcode clickHandler}) */
    index: PropTypes.number.isRequired,

    /** the element that renders this item */
    content: PropTypes.element.isRequired,
    /** flags if this element is highlighted (note that this is <strong>not</strong> used for rendering, only as a parameter to <code>highlightedRefCapturer</code>) */
    highlighted: PropTypes.bool.isRequired,

    /**
     * Called when this item is clicked.
     * @callback
     * @param {SyntheticEvent} the event
     * @param {number} the index of the clicked item
     */
    clickHandler: PropTypes.func.isRequired,

    /**
     * Called when this item renders a highlighted item.
     * @callback
     * @param {SyntheticEvent} the event
     * @param {DOMElement} the dom element rendering this item
     */
    highlightedRefCapturer: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.ref = null;      // the DOM element corresponding to this element
    this.handleRef = this.handleRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate (nextProps) {
    // do not render if props did not change
    return !shallowEqual(this.props, nextProps);
  }

  // We hook into this life-cycle method so we can invoke our callback when this item becomes highlighted.
  // Note that when this item was first mounted it may have been highlighted, and thus the current value of this.ref
  // may point to an old DOM element that has now been replaced by React.
  componentDidUpdate (prevProps, prevState) {
    if (this.props.highlighted) {
      this.props.highlightedRefCapturer(this.ref);
    }
  }

  // captures the initial (i.e. on mount) DOM element used to render this item
  handleRef (ref) {
    this.ref = ref;
    if (this.props.highlighted) {
      this.props.highlightedRefCapturer(this.ref);
    }
  }

  // handles onClick events for this item
  handleClick (event) {
    this.props.clickHandler(event, this.props.index);
  }

  // IMPORTANT: 3/28 - WORK AROUND - IE11 isn't working with an onClick on the component below
  // We moved to: onMouseDown, which was supported by ALL major browsers.
  render () {
    return (
      <li><div ref={this.handleRef} className={this.props.className} onMouseDown={this.handleClick}>{this.props.content}</div></li>
    );
  }

}
