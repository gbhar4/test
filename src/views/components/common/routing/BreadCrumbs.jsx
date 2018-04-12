/**
 * @module BreadCrumbs
 * @summary A React component rendering Bread Crumbs of a given Section Object and current subsetion location.
 * @author Citro
**/
import React from 'react';
import {PropTypes} from 'prop-types';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

export class BreadCrumbs extends React.Component {

  static propTypes = {
    /** This is passed down by react Route. */
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,

    /** an object describing the sections structure that this component should track movement within */
    sections: PropTypes.objectOf(PropTypes.shape({
      /** the unique id of this section */
      id: PropTypes.string.isRequired,
      /** the name to render in the breadCrumb for this section */
      displayName: PropTypes.string.isRequired,
      /** the path part of this section (relative to the page root) */
      pathPart: PropTypes.string.isRequired,
      /** the subsections of this section (recursively have the same structure */
      subSections: PropTypes.object
    })).isRequired
  }

  constructor (props) {
    super(props);
    this.state = {crumbs: this.getBreadCrumbs(props)};
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.sections !== this.props.sections || nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({crumbs: this.getBreadCrumbs(nextProps)});
    }
  }

  // NOTE: This function scans through the current path until it finds a matching section, then starts to generate the bread crumb
  getBreadCrumbs (props) {
    let {sections, location: {pathname}} = props;

    // Its possible we want the root of a page to also be considered a subsection
    if (pathname.substr(-1) !== '/') {
      pathname += '/';
    }

    let pathParts = pathname.split('/');
    let currentSections = sections;
    let breadCrumbs = [];

    // loop through all parts of the current path
    for (let currentPathPart of pathParts) {
      if (!currentSections) break;        // nowhere more to drill
      // for each path part we are checking to see if its in the current sections
      for (let key of Object.keys(currentSections)) {
        let currentSection = currentSections[key];
        // if the section in currentSections has a matching pathPart to that of the currentPathPart's last portion
        if (currentSection && currentSection.pathPart.split('/').pop() === currentPathPart) {
          currentSections = currentSection.subSections;
          breadCrumbs.push({
            element: <HyperLink destination={currentSection} className={`${currentSection.id}-link`}>{currentSection.displayName}</HyperLink>,
            key: currentSection.pathPart
          });
          break;
        }
      }
    }

    return breadCrumbs;
  }

  render () {
    return (
      <div className="breadcrum-container">
        {this.state.crumbs.map((crumb, index) => {
          return (
            <div className="breadcrum-link" key={crumb.key}>
              {index > 0 && ' / '}{crumb.element}
            </div>
          );
        })}
      </div>
    );
  }
}
