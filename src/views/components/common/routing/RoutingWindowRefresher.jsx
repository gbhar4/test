/** @module RoutingWindowRefresher
 * @summary a component that refreshes the page when the current location changes as the user
 * navigates between sections and sub-sections of the page.
 * Currently, performs the following operations:
 *   1. automatically scrolls the browser window up (if specified);
 *   2. calls the given callback method
 *
 * Note: this component renders nothing.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {LocationChangeTrigger} from 'views/components/common/routing/LocationChangeTrigger.jsx';
import {isClient} from 'routing/routingHelper';

export class RoutingWindowRefresher extends React.Component {

  static propTypes = {
    /** An object describing the sections and subsections structure that this component should track movement within
     * Note: this component assumes that whenever entering a sub-section a new '/' is introduced in the url.
     */
    sections: PropTypes.objectOf(PropTypes.shape({
      /** the path part of this section (relative to the page root) */
      pathPart: PropTypes.string.isRequired,
      /** the subsections of this section (recursively have the same structure */
      subSections: PropTypes.object,
      /** optional flag if to not scroll to the top of window when entering this subsection */
      dontScrollUpOnEntry: PropTypes.bool
    })).isRequired,

    /** callback to call on location change. Accpets: the new location, the new section. */
    onLocationChange: PropTypes.func,

    /** flags to ignore location changes if the section didn't change */
    isIgnoreChangesToSamePath: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  handleLocationChange (_, location) {
    let section = this.getSubSectionFromPath(location.pathname);
    this.props.onLocationChange && this.props.onLocationChange(location, section);
    if (isClient() && (!section || !section.dontScrollUpOnEntry)) {
      window.scrollTo(0, 0);
    }
  }

  render () {
    return (
      <LocationChangeTrigger onLocationChange={this.handleLocationChange} isIgnoreChangesToSamePath={this.props.isIgnoreChangesToSamePath} />
    );
  }

  getSubSectionFromPath (pathname) {
    let pathParts = pathname.split('/');
    let currentSections = this.props.sections;
    let currentSection = null;

    // loop through all parts of the current path
    for (let currentPathPart of pathParts) {
      if (!currentSections) break;        // nowhere more to drill - we need this test because sometimes there are extra path parts (e.g., indicating an orderId)
      // for each path part we are checking to see if its in the current sections
      for (let key of Object.keys(currentSections)) {
        currentSection = currentSections[key];
        // if the section in currentSections has a matching pathPart to that of the currentPathPart's last portion
        if (currentSection && currentSection.pathPart.split('/').pop() === currentPathPart) {
          currentSections = currentSection.subSections;
          break;
        }
      }
    }

    return currentSection;
  }
}
