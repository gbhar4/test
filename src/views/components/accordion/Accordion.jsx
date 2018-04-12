/**
* @module Accordion
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*
* Style (ClassName) Elements description/enumeration
*  accordion
*  accordion-expanded
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.accordion.scss');
} else {
  require('./_m.accordion.scss');
}

class Accordion extends React.Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,

    className: PropTypes.string,

    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,

    /**
     * flags if the accordion should collapse when it's content is clicked (true),
     * or only when it's header is clicked (false). Default value: true.
     */
    isCollapseOnContentClick: PropTypes.bool
  }

  static defaultProps = {
    isCollapseOnContentClick: false
  }

  constructor (props) {
    super(props);

    this.state = {
      expanded: !!props.expanded
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle () {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render () {
    let {className, children, title, isCollapseOnContentClick} = this.props;
    let {expanded} = this.state;
    let titleButton = 'Toggle ' + title; // Internationalization
    let accordionClassName = cssClassName('accordion ', {'accordion-expanded ': expanded}, className);

    return (
      <div className={accordionClassName}
        onClick={isCollapseOnContentClick ? this.handleToggle : null}>
        <h4 className="accordion-button-toggle" onClick={this.handleToggle}>{title}
          <button type="button" className="accordion-toggle" title={titleButton}></button>
        </h4>

        {expanded &&
          <section className="accordion-element">
            {children}
          </section>
        }
      </div>
    );
  }
}

export {Accordion};
