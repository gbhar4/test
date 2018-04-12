/**
* @module DOM Accordion
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*
* Style (ClassName) Elements description/enumeration
*  accordion
*  accordion-expanded
*/
import React from 'react';
import {closestOfType} from 'util/viewUtil/closestOfType.js';
import {isClient} from 'routing/routingHelper';

class DOMAccordionToggleTrigger extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.handleAccordionToggle = this.handleAccordionToggle.bind(this);

    if (isClient()) {
      document.addEventListener('keyup', this.handleAccordionToggle, true);
      document.addEventListener('click', this.handleAccordionToggle, true);
    }
  }

  componentWillUnmount () {
    if (isClient()) {
      document.removeEventListener('keyup', this.handleAccordionToggle, true);
      document.removeEventListener('click', this.handleAccordionToggle, true);
    }
  }

  handleAccordionToggle (event) {
    if (isClient()) {
      let title = closestOfType(event.target, 'H4');

      if (title && title.attributes['data-accordion-toggle']) {
        if (title.parentNode.className === 'accordion') {
          title.parentNode.className = 'accordion accordion-expanded';
        } else {
          title.parentNode.className = 'accordion';
        }
      }
    }
  }

  render () {
    return null;
  }
}

export {DOMAccordionToggleTrigger};
