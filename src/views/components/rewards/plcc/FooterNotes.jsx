/**
 * @module Plcc Rewards Content
 * @author Damián Rossi <drossi@minutentag.com>
 * Shows a benefiths for My Place Rewards0
 * @param TermsAndConditions = shows the terms and conditions
 * @todo Replace the json content for one focused content instead array of objects.
 */
import React from 'react';
import {PropTypes} from 'prop-types';

export class FooterNotes extends React.Component {
  static propTypes = {
    /**
     * The Terms and Conditions provided by json
     */
    footerNotes: PropTypes.arrayOf(PropTypes.shape({
      footerNoteId: PropTypes.number,
      footerNoteContent: PropTypes.string
    }))
  }

  render () {
    let {footerNotes} = this.props;
    return (
      <div clssName="termsAndConditions">
        <ol className="container-list-terms-and-conditions">
             {footerNotes.map((item) => {
               return (
                 <li key={item.footerNoteId} className={'item-term-and-condition'}>{item.footerNoteContent}</li>);
             })}
        </ol>
      </div>
    );
  }
}
