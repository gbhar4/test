/**
/** @module ButtonTooltip
 * @summary Component with button that show a Tooltip
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @TODO Open and close state for tooltip
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Tooltip} from 'views/components/tooltip/Tooltip.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.button-tooltip.scss');
} else {
  require('./_m.button-tooltip.scss');
}

const INFO = 'info';
const TOOLTIP = 'tooltip';

const TOP = 'top';
const BOTTOM = 'bottom';
const LEFT = 'left';
const RIGHT = 'right';

class ButtonTooltip extends React.Component {
  static propTypes = {
    /** The CSS class to use for the title text(please fix this comnment to be more accurate) */
    className: PropTypes.string,

    /* Title of message content */
    title: PropTypes.string,

    /* Type of tooltip: info or tooltip icon */
    type: PropTypes.oneOf([INFO, TOOLTIP]).isRequired,

    /* Direction of tooltip opening: up, down, left or right arrow (if not specified BOTTOM is used) */
    direction: PropTypes.oneOf([TOP, BOTTOM, LEFT, RIGHT])
  }

  static defaultProps = {
    direction: BOTTOM
  }

  constructor (props) {
    super(props);

    this.state = {
      isOpen: !!props.isOpen
    };

    this.handleToogleTooltip = this.handleToogleTooltip.bind(this);
    this.handleCloseTooltip = this.handleCloseTooltip.bind(this);
    this.captureContainerDivRef = this.captureContainerDivRef.bind(this);

    if (this.state.isOpen) {
      document.addEventListener('mousedown', this.handleCloseTooltip, true);
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.isOpen !== this.props.isOpen) {
      this.setState({
        isOpen: newProps.isOpen
      });
    }
  }

  componentDidUpdate () {
    document.removeEventListener('mousedown', this.handleCloseTooltip, true);

    if (this.state.isOpen) {
      document.addEventListener('mousedown', this.handleCloseTooltip, true);
    }
  }

  captureContainerDivRef (ref) {
    this.containerDivRef = ref;
  }

  handleToogleTooltip () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleCloseTooltip (event) {
    if (event.target === this.containerDivRef || (this.containerDivRef && this.containerDivRef.contains(event.target))) {
      return;
    }

    this.setState({
      isOpen: false
    });
  }

  render () {
    let {className, children, title, type, direction} = this.props;

    let containerTooltipClass = cssClassName('button-tooltip-container ', className);
    let typeTooltipClass = cssClassName('button-', type, '-wire');
    let typeTooltipOpenClass = cssClassName('button-', type);
    let directionTooltipClass = cssClassName('arrow-direction-', direction);
    let buttonLabel = `${this.state.isOpen ? 'Close' : 'Open'} ${title ? title : ''} tooltip`;

    return (
      <div ref={this.captureContainerDivRef} onClick={this.handleToogleTooltip} className={containerTooltipClass}>
        <button type="button" className={!this.state.isOpen ? typeTooltipClass : typeTooltipOpenClass} aria-label={buttonLabel} />
        {this.state.isOpen && <Tooltip title={title} directionClass={directionTooltipClass}>
          {children}
        </Tooltip>
        }
      </div>
    );
  }
}

export {ButtonTooltip};
