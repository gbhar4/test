/**
 * @module HeaderGlobalTopBar
 * @author Gabriel Gomez
 * Component which renders a list of content slots (array) and its properties.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

export class ContentSlotList extends React.Component {

  static propTypes = {
    /** List that holds all content slots and its properties.
     the array will describe the following:
    */
    contentSlots: PropTypes.arrayOf(PropTypes.shape({
      contentSlotName: PropTypes.string.isRequired,
      props: PropTypes.object
    })).isRequired,

    /** String to add specific class to content slot */
    className: PropTypes.string
  }

  render () {
    let {contentSlots, className} = this.props;
    className = cssClassName(
      'content-slot-list-container ',
      className
    );

    return (
      <div className={className}>
        {contentSlots.map((slot) => <ContentSlot key={slot.contentSlotName} contentSlotName={slot.contentSlotName} {...slot.props} />)}
      </div>
    );
  }
}
