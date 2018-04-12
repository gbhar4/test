/** @module DropdownList
 * Note: this component is not meant to be directly used in forms!
 * It is a helper component for rendering the dropdown portion of other components such as  CustomSelect or Combobox
 *
 * @summary A React component rendering a dropdown list of options to select from.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import invariant from 'invariant';
import cssClassName from 'util/viewUtil/cssClassName';
import {SelectItem} from './SelectItem.jsx';

const PROP_TYPES = {
  /**
   * The CSS class name prefix to use for this element.
   *
   * The class names for parts of this element are derived by appendig the following strings:
   * <code>'-item'</code>: the CSS class to use for an unselected option
   * <code>'-selected'</code>: the CSS class to use for a selected option
   * <code>'-highlighted'</code>: the CSS class to use for a highlighted
   * <code>'-disabledOption'</code>: the CSS class to use for a disabled option
   *
   * Please note that the classes for selected, highlited and disabled elements will be added (instead of replace), as needed, to the item class
   */
  classNamePrefix: PropTypes.string.isRequired,

  /**
   * The list of items to show in this dropdown.
   * Note that this map must be immutable. I.e., any change to the list of items in this component's dropdown whould be performed
   * by changing the array passed as this prop.
   *
   * This is an array of plain objects, each representing one item in the dropdown. Each object has three fields, as follows:
   *  value: the internal value representing this item. This is not shown to the user, and is essentially the id used in javascript
   *         code to identify this item. This is similar to the <code>value</code> attribnute of an HTML <code>option</code> element.
   *  content: what the user sees for this item when the dropdown is expanded. This is a react element (not simply a string) since
   *          the main purpose of this component is to allow one to render complex contents for each item, which the HTML
   *          <code>option</code> cannot do.
   *  disabled: Flags if this option cannot be selected.
   */
  optionsMap: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    content: PropTypes.element.isRequired,
    disabled: PropTypes.bool
  })).isRequired,

  /** event handler for mouse clicks on items of this list */
  handleItemClick: PropTypes.func.isRequired,

  /** the selected item's index, or -1 if no item is highlighted */
  highlightedIndex: PropTypes.number.isRequired,

  /** if a number, then it is the selected item's index, or -1 if no item is selected
   * if an array, then it is of the same length as optionsMap, and each entry is a flag indicating whether
   * the corresponding entry in optionsMap is selected or not (used when multiple selections are needed)
   */
  selectedIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.bool)])
};

class DropdownList extends React.Component {

  // --------------- static methods --------------- //
  /**
   * @return the first index in optionsMap starting at index start, and incrementing by increment while scanning;
   * returns -1 if start is out of bounds, or if all items scanned are disabled
   */
  static getFirstEnabledIndex (optionsMap, start, increment) {
    let result = start;
    while (true) {
      if (result < 0 || result >= optionsMap.length) {
        return -1;
      } else if (optionsMap[result].disabled) {
        result += increment;
      } else {
        return result;
      }
    }
  }

  /**
   * @return a new highlighted index into optionsMap, given the current one and the specified direction;
   * returns -1 if all items in the direction specified are disabled
  */
  static getNewHighlightIndex (optionsMap, index, direction) {
    switch (direction) {
      case 'up':
        // look for first enabled item above the currently highlighted item
        return DropdownList.getFirstEnabledIndex(optionsMap, index - 1, -1);
      case 'down':
        // look for first enabled item below the currently highlighted item
        return DropdownList.getFirstEnabledIndex(optionsMap, index + 1, +1);
      case 'start':
        // look for first enabled item in optionsMap
        return DropdownList.getFirstEnabledIndex(optionsMap, 0, +1);
      case 'end':
        // look for last enabled item in optionsMap
        return DropdownList.getFirstEnabledIndex(optionsMap, optionsMap.length - 1, -1);
      default:
        invariant(true, `${this.displayName}: unknown destination of highlited option ${direction}`);
        return;     // eslint-disable-line no-useless-return
    }
  }
  // --------------- end of static methods --------------- //

  constructor (props) {
    super(props);
    this.highlightedRef = null;                   // the HTML DOM element of the currently highlighted item
    this.itemsListRef = null;                     // the HTML DOM element of the ul element rendering the dropdown list of items of this component
    this.scrollToHighlightedOnUpdate = true;     // true if itemsListRef should be scrolled to show highlightedRef after this component renders

    // bind methods that are passed as callbacks
    this.captureItemsListRef = this.captureItemsListRef.bind(this);
    this.captureHighlightedRef = this.captureHighlightedRef.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.optionsMap !== nextProps.optionsMap || this.props.highlightedIndex !== nextProps.higlightedIndex) {
      // flag that after this component renders the highlighted element should be scrolled into view
      this.scrollToHighlightedOnUpdate = true;
    }
  }

  componentDidMount (prevProps, prevState) {
    if (this.scrollToHighlightedOnUpdate) {     // if needs to scroll to put the highlighted item into view
      this.scrollToHighlighted();
      this.scrollToHighlightedOnUpdate = false;
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.scrollToHighlightedOnUpdate) {     // if needs to scroll to put the highlighted item into view
      this.scrollToHighlighted();
      this.scrollToHighlightedOnUpdate = false;
    }
  }

  render () {
    let {classNamePrefix, optionsMap, selectedIndex, handleItemClick} = this.props;
    if (optionsMap.length < 0) return null;

    let selectedClassStr = ' item-selected ' + classNamePrefix + '-selected';
    let highlightedClassStr = ' item-highlighted ' + classNamePrefix + '-highlighted';
    let disablededClassStr = ' item-disabledOption ' + classNamePrefix + '-disabledOption';
    let isMultipleSElections = Array.isArray(selectedIndex) && selectedIndex.length > 0;

    return (
      <div className="list-container">
        <ul ref={this.captureItemsListRef} className={cssClassName('item-list-common ', classNamePrefix, '-items-list')}>
          {optionsMap.map((item, index) =>
            // observe that we make sure that all event handlers are constants (i.e., not calculated here).
            // this ensures that props of items change only if what they need to render changes
            <SelectItem key={item.value} index={index} content={item.content} highlighted={index === this.props.highlightedIndex}
              highlightedRefCapturer={this.captureHighlightedRef} clickHandler={handleItemClick}
              className={cssClassName('item-common ', classNamePrefix, '-item',
                {[selectedClassStr]: index === selectedIndex || (isMultipleSElections && selectedIndex[index])},
                {[highlightedClassStr]: index === this.props.highlightedIndex},
                {[disablededClassStr]: item.disabled}
              )}
            >
              {item.content}
            </SelectItem>
          )}
        </ul>
      </div>
    );
  }

  // --------------- private methods --------------- //
  captureItemsListRef (ref) {
    this.itemsListRef = ref;
  }

  captureHighlightedRef (ref) {
    this.highlightedRef = ref;
  }

  // called to scroll this.itemsListRef to bring this.itemsListRef into view (i.e. to show the highlited item)
  scrollToHighlighted () {
    if (this.highlightedRef) {
      let itemsListRect = this.itemsListRef.getBoundingClientRect();
      let highlightedItemRect = this.highlightedRef.getBoundingClientRect();
      if (highlightedItemRect.bottom > itemsListRect.bottom || highlightedItemRect.top < itemsListRect.top) {
        this.itemsListRef.scrollTop = (this.highlightedRef.offsetTop + this.highlightedRef.clientHeight - this.itemsListRef.offsetHeight);
      }
    }
  }
  // --------------- end of private methods --------------- //

}
DropdownList.propTypes = PROP_TYPES;

export {DropdownList};
