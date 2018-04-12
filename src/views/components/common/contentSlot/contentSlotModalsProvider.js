/** @module contentSlotModalsProvider
 *
 *  @author Ben
 */
import {contentSlotModalsTable} from './contentSlotModalsTable';

let previous = null;
export function getContentSlotModalsProvider (openModal) {
  if (!previous) {
    previous = new ContentSlotModalsProvider((publicModalId) => {
      let modalTableEntry = contentSlotModalsTable[publicModalId];
      if (modalTableEntry) {
        openModal(modalTableEntry.modalId);
      }
    });
  }
  return previous;
}

class ContentSlotModalsProvider {
  constructor (showModal) {
    this.showModal = showModal;
  }
}
