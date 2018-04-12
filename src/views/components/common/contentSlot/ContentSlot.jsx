/** @module ContentSlot
 * @author Ben
 * Exports a component for displaying content-slots (AKA e-slots), i.e., exteranl HTML markup that is provided by an external source.
 *
 * Note that the component performs <strong>no</strong> sanitation of the passed HTML markup (which may contain scripts etc.) and
 * thus XSS attacks can be easily launched if the supplied HTML can in any way come from a user.
 */
import {PropTypes} from 'prop-types';
import {ContentSlotRenderer} from './ContentSlotRenderer.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';

/**
 * The propTypes associated with <code>ContentSlot</code>
 * @type {Object}
 */
const PROP_TYPES = {
  /** The name (id) of the content slot */
  contentSlotName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  /** For test purposes only - flags if this component should be visible */
  isVisibleTest: PropTypes.bool,
  /** For test purposes only - if present, it is the HTML to render in this ontent slot */
  htmlContentTest: PropTypes.string,

  /** The CSS class to use for the rendered HTML */
  className: PropTypes.string,
  /**
   * If not present, and the content slot with the above contentSlotName is marked as invisible then this element renders nothing;
   * otherwise, it renders with this CSS class instead of this.props.classname
   */
  hiddenClassName: PropTypes.string
};

// #if !STATIC2
function mapStateToProps (state, ownProps, storeOperators) {
  let contentSlotName = Array.isArray(ownProps.contentSlotName) ? ownProps.contentSlotName : [ownProps.contentSlotName];
  let espot;

  // NOTE: review with ben, this was added to support priority based eSpots
  for (let espotName of contentSlotName) {
    espot = generalStoreView.getEspotByName(state, espotName);
    if (espot && espot.value) {
      break;
    }
  }

  return {
    htmlContent: espot && espot.value ? espot.value : '',
    // FIXME: we need to add support to hide espots
    isVisible: true
  };
}

// we need this to prevent the extra props of this container object from being propagated to the contained form
function mergeProps (stateProps, dispatchProps, ownProps) {
  let {contentSlotName, isVisibleTest, htmlContentTest, ...otherProps} = ownProps;   // eslint-disable-line
  return {...otherProps, ...stateProps};
}

let ContentSlot = connectPlusStoreOperators(
  {generalOperator: getGeneralOperator}, mapStateToProps, null, mergeProps
)(ContentSlotRenderer);
ContentSlot.propTypes = {...ContentSlot.propTypes, ...PROP_TYPES};
ContentSlot.displayName = 'ContentSlot';
// #endif

//
//
//
// #if STATIC2
// --------------For Static Testing only------------------
function mapStaticToProps (_, ownProps) {
  // html content is the passed htmlContentTest (if exists) or a simple <p> stating the content slot id
  let htmlContent = ownProps.htmlContentTest ? ownProps.htmlContentTest : `<p>Content-slot place-holder for: ${ownProps.contentSlotName}</p>`;
  // isVisible is the passed isVisibleTest (if exists) or true.
  let isVisible = typeof ownProps.isVisibleTest !== 'undefined' ? ownProps.isVisibleTest : true;
  return {
    htmlContent: htmlContent,
    isVisible: isVisible
  };
}

// we need this to prevent the extra props of this container object from being propagated to the contained form
function mergeStaticProps (stateProps, dispatchProps, ownProps) {
  let {contentSlotName, isVisibleTest, htmlContentTest, ...otherProps} = ownProps;   // eslint-disable-line
  return {...otherProps, ...stateProps};
}

let ContentSlot = connectPlusStoreOperators( // eslint-disable-line no-redeclare
  mapStaticToProps, null, mergeStaticProps
)(ContentSlotRenderer);
ContentSlot.propTypes = {...ContentSlot.propTypes, ...PROP_TYPES};
ContentSlot.displayName = 'ContentSlot';
// #endif

export {ContentSlot};
