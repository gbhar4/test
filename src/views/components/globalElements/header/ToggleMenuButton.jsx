import React from 'react';
import cssClassName from 'util/viewUtil/cssClassName';

require('./_toogle-menu-button.scss');

export class ToggleMenuButton extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isActive: false
    };

    this.handleClick = this.handleToggleActiveClass.bind(this, true);
    this.handleFocus = this.handleToggleActiveClass.bind(this, false);
  }

  handleToggleActiveClass (isActive) {
    this.setState({
      isActive
    });
  }

  render () {
    let {isActive} = this.state;
    let {isExpanded} = this.props;
    let className = cssClassName('toggle-menu-button ', {
      'toggle-menu-button-active': isActive
    });
    let accessibleText = isExpanded ? 'Collapse Menu' : 'Expand Menu';

    return (
      <button type="button" onClick={this.props.onClick} onFocus={this.props.onFocus} className={className} title={accessibleText}>{accessibleText}</button>
    );
  }
}
