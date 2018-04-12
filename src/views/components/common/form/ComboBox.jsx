// aria support ?
// searchable support ?
// do we want a "clearable" property, and a clear button? (currently escape clears)
// see if we need more events emitted (like open/close)
// do we need otherProps to spread into the containing div?
// meta prop and errors display
// -closed should replace or be added to base CSS class?

/** @module Combobox
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {DropdownList} from './dropdown/DropdownList.jsx';

export class Combobox extends React.Component {

  static propTypes = {
    /** an optional text to display in the label for this component. */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /** <code>true</code> if this element is disabled  */
    disabled: PropTypes.bool,

    /**
     * This text is shown when the selected value (see <code>propTypes.input.value</code> below) is the empty string.
     * If defined, the user can select the empty String by pressing the `escape` key when the dropdown is closed.
     */
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /** The icon of the button (that expands the dropdown) in the un-expanded state */
    buttonIconClosed: PropTypes.string,

    /** The icon of the button (that expands the dropdown) in the expanded state */
    buttonIconExpanded: PropTypes.string,

    /**
     * The CSS class to use for this element when the dropdown is expanded.
     *
     * The class names for other parts/states of this element are derived by appendig the following strings:
     * <code>'-input'</code>: the CSS class for the input elemenet of this combobox
     * <code>'-button'</code>: the CSS class to use for the drop button when the dropdown is expanded
     * <code>'-button-closed'</code>: the CSS class to use for the drop button when the dropdown is closed
     * <code>'-items-list'</code>: the CSS class to use for the container element of all the items when the dropdown is expanded
     * <code>'-item'</code>: the CSS class to use for an unselected option when the dropdown is expanded
     *
     * <code>'-disabled'</code>: the CSS class to use for this element if the whole Combobox is disabled
     * <code>'-highlighted'</code>: the CSS class to use for a highlighted option when the dropdown is expanded
     * <code>'-disabledOption'</code>: the CSS class to use for a disabled option when the dropdown is expanded
     *
     * Note that the classes for selected, highlited, disabled and disabledOption will be added (instead of replace), as needed.
     */
    className: PropTypes.string.isRequired,

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
     *  title: This is what the user sees if the item is the selected item, and the dropdown is closed (i.e., not expanded).
     *         Note that this must be either a string or an inline element (i.e., one that can be rendered inside a <code>span</code>).
     *  disabled: Flags if this option cannot be selected.
     *
     */
    optionsMap: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      content: PropTypes.element.isRequired,
      disabled: PropTypes.bool
    })).isRequired,

    /**
     * If using Redux-forms, this is passed down to this object automatically by the enclosing <code>Field</code> component.
     */
    input: PropTypes.shape({
      /**
       * The value of the selected item. Note that this value may be different than all the values in the <code>optionsMap</code> prop.
       */
      value: PropTypes.string.isRequired,
      /** Called when the input text of this component is changed by the user. Passed in by an enclosing Redux-Form <code>Field</code> */
      onChange: PropTypes.func,
      /** Called when this component loses focus. Passed in by an enclosing Redux-Form <code>Field</code> */
      onBlur: PropTypes.func,
      /** Called when this component receives focus. Passed in by an enclosing Redux-Form <code>Field</code> */
      onFocus: PropTypes.func
    }),

    /**
     * @summary called when the user `selects' a value in the combobox.
     * Note that:
     *  (1) this happens when the user either clicks/taps an item in the dropdown or presses the `Enter' key;
     *  (2) this is not the same as changing the value of the combobox;
     *  (3) this is not a regular React event --- this callback receives the most recent value of this component.
     */
    onSelectCallback: PropTypes.func,

    /**
     * @summary called when the user changes the value typed into the combobox.
     * Note that:
     *  (1) this happens when the user types into the input element of the combobox;
     *  (2) this is NOT called when the user moves the highlight in the dropdown (even though the <code>value</code> of this component chages).
     *  (3) this is not the same as changing the value of the combobox;
     *  (4) callback accepts a React <code>change</code> event as a parameter.
     */
    onTypedValueChange: PropTypes.func,

    /** the HTML tabing index of the containing div of this componet, if not defined, this component uses <code>tabindex=0</code> */
    tabIndex: PropTypes.number,

    /**
     * Flags if the dropdown should be rendered expanded.
     */
    expanded: PropTypes.bool,

    /**
     * Flags if the dropdown should close when focus is removed
     */
    closeOnBlur: PropTypes.bool,

    /**
     * Flags if the dropdown should expand when this element recieves focus
     */
    expandOnFocus: PropTypes.bool,

    /**
     * Flags if the dropdown should expand whenever the value in the input element changes
     */
    expandOnChange: PropTypes.bool,

    /**
     * Flags if the item with the current value (if there ie one) should be highlighted when the dropdown expands
     */
    highlightSelectedOnExpand: PropTypes.bool
  }

  static defaultProps = {
    closeOnBlur: true
  }

  static comboboxCounter = 0;

  constructor (props) {
    super(props);
    this.containerDivRef = null;                  // the HTML DOM element of the containing div element of this component
    this.inputRef = null;                         // the HTML DOM element of the input element of this component
    this.state = {
      expanded: !!props.expanded,                 // true if this component is expanded, false if closed;
      highlightedIndex: -1,                       // index into this.props.optionsMap of the highlighted item in the dropdown
      lastTypedValue: props.input.value || '',    // the last value actually typed by the user (as opposed to coming from moving the dropdown highlight)
      displayValue: props.input.value || ''       // the value the user sees in the input element
    };

    // bind methods that are passed as callbacks
    this.captureContainerDivRef = this.captureContainerDivRef.bind(this);
    this.captureInputRef = this.captureInputRef.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.comboboxCounter = Combobox.comboboxCounter++;
  }

  captureContainerDivRef (ref) {
    this.containerDivRef = ref;
  }

  captureInputRef (ref) {
    this.inputRef = ref;
  }

  // returns the index of the item with the given value in the given optionsMap
  getIndexOfValue (optionsMap, value) {
    return this.props.optionsMap.findIndex((item) => item.value === value);
  }

  // handles clicks on the button that opens the dropdown
  handleButtonClick (event) {
    if (!this.state.expanded && !this.props.disabled && event.button === 0) {
      this.expandMenu();
    }
  }

  // handles mouse clicks on items in the dropdown
  handleItemClick (event, clickedItemIndex) {
    if (event.button !== 0) return;          // ignore clicks not on the main (left) mouse button
    //  event.preventDefault();
    if (!this.props.optionsMap[clickedItemIndex].disabled) {              // ignore clicks on disabled items
      this.setHighlightedIndex(clickedItemIndex);                         // make the clicked item highlighted
      let clickedValue = this.props.optionsMap[clickedItemIndex].value;
      this.setValue(clickedValue);            //  set the value of this component to the value of the clicked item
      this.valueSelected(clickedValue);       // notify listeners that the user selected a value
    }
  }

  // handles blur events of the containing div of this component
  handleBlur (event) {
    // if the user moved focus outside this component
    if (event.relatedTarget !== this.containerDivRef && !this.containerDivRef.contains(event.relatedTarget)) {
      // notify our listeners that this component is blured
      if (this.props.input && this.props.input.onBlur) this.props.input.onBlur(event);

      if (this.props.closeOnBlur) {
        this.closeMenu();       // close the dropdown
      }
    }
  }

  // handles focus events of the containing div of this component
  handleFocus (event) {
    if (this.props.expandOnFocus) {
      this.expandMenu();
    }
    // notify our listeners that this component was focused
    if (this.props.input && this.props.input.onFocus) this.props.input.onFocus(event);
  }

  // handles key presses for this component
  handleKeyDown (event) {
    if (this.props.disabled) return;        // ignore everything if this compoinent is disabled

    switch (event.keyCode) {
      case 13: // enter
        if (this.state.expanded && this.state.highlightedIndex < 0) {
          this.selectHighlightedItem();         // the user selected the currently highlighted item
        }
        this.valueSelected(this.props.input.value);       // notify listeners that the user selected the current input value
        break;
      case 27: // escape
        if (this.state.expanded) {
          this.closeMenu();                       // close the dropdown if it is open
        }
        break;
      case 38: // up
        this.moveHighlightOrExpand('up');
        break;
      case 40: // down
        this.moveHighlightOrExpand('down');
        break;
      default:
        return;       // ignore any other key events (this skips the event.preventDefault() below)
    }
    event.preventDefault();
  }

  handleInputChange (event) {
    if (this.props.expandOnChange) {
      this.expandMenu();
    }
    // notify our listeners that the user typed in a new value
    if (this.props.onTypedValueChange) this.props.onTypedValueChange(event);
    // notify our listeners that the user wants the value of this component to change
    if (this.props.input && this.props.input.onChange) this.props.input.onChange(event);

    // setTimeout because the following code will cause a re-render which will lose the cursor position (place it in the end)
    // we have to let the change above get executed before React re-renders, so it gets the new value and does not get confused
    let value = event.target.value; // moved outside of the timeout because we're not using event.persist();
    setTimeout(() => {
      this.setHighlightedIndex(-1);
      this.setState({lastTypedValue: value});
    });
  }

  valueSelected (value) {
    // consider selected values as if they were typed in by the user (but do not fire TypedValueChange event)
    this.setState({lastTypedValue: value});
    if (this.props.onSelectCallback) this.props.onSelectCallback(value);
    this.closeMenu(true);                // close the dropdown
  }

  // closes the dropdown
  closeMenu (itemWasSelected) {
    if (!this.state.expanded) return;
    this.setState({expanded: false, highlightedIndex: -1});
  }

  // opens the dropdown
  expandMenu () {
    if (this.state.expanded) return;
    this.setState({expanded: true});
    if (this.props.highlightSelectedOnExpand) {
      this.setHighlightedIndex(this.getIndexOfValue(this.props.optionsMap, this.props.input.value));
    }
  }

  setHighlightedIndex (index) {
    this.setState({highlightedIndex: index});
  }

  // select the currently highlighted item
  selectHighlightedItem () {
    let highlightedItem = this.props.optionsMap[this.state.highlightedIndex];
    if (highlightedItem) {
      this.setValue(highlightedItem.value);
      this.valueSelected(highlightedItem.value);       // notify listeners that the user selected a value
    }
  }

  // select the item with the given value
  setValue (value) {
    // if the value to select is not the current value of this component
    if (this.props.input && this.props.input.value !== value) {
      // notify our listeners that the user wants the value of this component to change
      if (this.props.input.onChange) this.props.input.onChange(value);
    }
  }

  // if dropdown is expanded then move highlight to the item in the specified destination
  // if dropdown is closed then simply expand it
  moveHighlightOrExpand (direction) {
    if (!this.state.expanded) {
      this.expandMenu();
    } else {
      let newHighlightedIndex = DropdownList.getNewHighlightIndex(this.props.optionsMap, this.state.highlightedIndex, direction);
      if (direction === 'up' && newHighlightedIndex < 0) {        // if on top most (enabled) item and moving up (i.e. towards the input element)
        this.setHighlightedIndex(-1);               // remove any highlight
        if (this.state.lastTypedValue) this.setValue(this.state.lastTypedValue);        // restore value to the last one typed by the user
      } else if (newHighlightedIndex >= 0) {
        this.setHighlightedIndex(newHighlightedIndex);
        if (newHighlightedIndex >= 0) {
          this.setValue(this.props.optionsMap[newHighlightedIndex].value);    // make the value of this component be that of the highlighted item
        }
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.expanded !== this.props.expanded) {
      this.setState({expanded: nextProps.expanded});
    }
    if (this.props.optionsMap !== nextProps.optionsMap && this.state.highlightedIndex > 0) {
      // sync. this.state.highlightedIndex with the new optionsMap
      // (to point to the smae highlighted item as now if possible)
      this.setState({highlightedIndex: this.getIndexOfValue(nextProps.optionsMap, this.props.optionsMap[this.state.highlightedIndex].value)});
    }
  }

  render () {
    let {
      title,
      buttonIconExpanded,
      buttonIconClosed,
      placeholder,
      disabled,
      className,
      optionsMap,
      input: {onChange, ...otherInputProps},            // eslint-disable-line no-unused-vars
      /* **** we do not want the props in the next two line to be part of otherProps */
      meta, expanded, highlightSelectedOnExpand,        // eslint-disable-line no-unused-vars
      onSelectCallback, expandOnFocus, expandOnChange, notifyOnlyOnTypingChanges, onTypedValueChange, closeOnBlur,  // eslint-disable-line no-unused-vars
      /* ***                                                                        */
      ...otherProps
    } = this.props;

    let buttonIconText = this.state.expanded ? buttonIconExpanded : buttonIconClosed; // || '+';
    let containingClassName = cssClassName(className, {'-closed': !this.state.expanded}, {'-disabled': disabled});
    let inputId = `combobox_${this.comboboxCounter}`;

    return (
      <div ref={this.captureContainerDivRef} className={containingClassName}
        onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} onFocus={this.handleFocus}>
        {title && <span>{title}</span>}
        <label htmlFor={inputId} className="sr-only">{placeholder}</label>
        <input {...otherInputProps} {...otherProps} id={inputId} type="text" ref={this.captureInputRef} placeholder={placeholder} className={className + '-input'}
          onChange={this.handleInputChange} disabled={disabled} />
        <div role="button" tabIndex="-1" className={cssClassName(className, '-button', {'-closed': !this.state.expanded})}
          onClick={this.handleButtonClick}>{buttonIconText}</div>
        {this.state.expanded && optionsMap.length > 0 &&
          <DropdownList expanded classNamePrefix={className} optionsMap={optionsMap} highlightedIndex={this.state.highlightedIndex}
            ref={this.captureDropdownRef} handleItemClick={this.handleItemClick} />
        }
      </div>
    );
  }

}
