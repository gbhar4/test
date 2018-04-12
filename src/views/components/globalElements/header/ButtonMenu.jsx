import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
class ButtonMenu extends React.Component {
  static propTypes = {
    /** handler for onclick */
    onClick: PropTypes.func.isRequired
  }

  render () {
    let { isCloseButton } = this.props;

    let buttonClassName = cssClassName('button-menu ', {'button-menu-open': isCloseButton});

    return (
      <button type="button" onClick={this.props.onClick} className={buttonClassName} title="Toggle global navigation">
        <div>
          <hr />
          <hr />
          <hr />
        </div>
      </button>
    );
  }
}

export {ButtonMenu};
