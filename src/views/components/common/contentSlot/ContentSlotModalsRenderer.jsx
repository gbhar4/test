/** @module ContentSlotModalsRenderer
 * renders modals (such as login) requested by CTAs in content slots
 *
 *  @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {getContentSlotModalsProvider} from './contentSlotModalsProvider';
import {contentSlotModalsTable} from './contentSlotModalsTable';

export class ContentSlotModalsRenderer extends React.Component {

  static propTypes = {
    /** the id of the modal to open */
    modalId: PropTypes.string.isRequired,

    /** method for setting the activemodal id */
    openModal: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (window && !window.modalsProvider) {
      window.modalsProvider = getContentSlotModalsProvider(this.props.openModal);
    }
  }

  render () {
    let {modalId} = this.props;
    let modalTableEntryKey = Object.keys(contentSlotModalsTable).find((key) => contentSlotModalsTable[key].modalId === modalId);
    if (!modalTableEntryKey) {
      return null;      // do not render anything if no (or unknown) modal is specified
    }
    let ModalComponent = contentSlotModalsTable[modalTableEntryKey].component;

    return (
      <ModalComponent {...contentSlotModalsTable[modalTableEntryKey].componentProps} />
    );
  }

}
