/**
/** @module siteMap
 * @summary
 *
 * @author Oliver
 */

import React from 'react';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.site-map.scss');
} else {
  require('./_m.site-map.scss');
}

export class SiteMap extends React.Component {

  componentWillUpdate () {
    let clase = document.querySelectorAll('.level-three-container');

    for (let item of clase) {
      let button = item.querySelector('.level-three-button');
      button.addEventListener('click', this.handleDrop);
      item.className = 'level-three-container';  // need to take the class .active of item
    }
  }

  handleDrop () {
    let item = this.parentElement;
    let itemClass = item.className;

    if (itemClass.search('active') !== -1) {
      item.className = 'level-three-container';
      return;
    }

    item.className = item.className + ' active';
  }

  render () {
    return (
      <div className="site-map-container">
        {/* <h1 className="title">Site Map</h1> */}
        <ContentSlot contentSlotName="sitemap_content" className="site-map-banner" />

        {/*
          <div className="site-map-container">
          <h1 className="title">Site Map</h1>
          <div className="level-one-container">
            <ol className="level-two-container">
              <h4 className="level-two-title">
                <a href="http://www.childrensplace.com/shop/us/c/girls-clothing">Girls Clothing</a>
              </h4>

              <li>
                <ul className="level-three-container">
                  <button className="level-three-button">Girls Summer Shorts</button>
                  <h5><a href="own-plp-link" className="level-three-title">Girls Summer Shorts</a></h5>
                  <li className="level-four-title">
                    <a href="http://www.childrensplace.com/shop/SearchDisplay?departmentId=47511&langId=-1&urlRequestType=Base&showResultsPage=true&categoryId=433015&sType=SimpleSearch&searchType=1002&searchTermScope=&resultCatEntryType=&minPrice=&filterTerm=&catalogId=10551&urlLangId=-1&searchTerm=&storeId=10151&beginIndex=0&maxPrice=&manufacturer=">Girls Warm Weather Shorts</a>
                  </li>
                </ul>
              </li>

            </ol>
          </div>
        </div>
      */}

        {/* <h1 className="title">Site Map</h1>

        {navitagionTree.map((levelOne) => {
          return (
            <div key={levelOne.categoryId} className="level-one-container">
              <h2 className="level-one-title">{levelOne.name}</h2>

              {levelOne.children && levelOne.children.map((levelTwo) => {
                return (
                  <ol key={levelTwo.categoryId} className="level-two-container">
                    <h4 className="level-two-title"><a>{levelTwo.name}</a></h4>

                    <li>
                      {levelTwo.children && levelTwo.children.map((levelThree) => {
                        return (
                          <ul key={levelThree.categoryId} className="level-three-container">
                            <button className="level-three-title" onClick={this.handleDeployList}>{levelThree.name}</button>
                            {levelThree.children && levelThree.children.map((levelFour) => {
                              return (
                                <li key={levelFour.categoryId} className="level-four-title"><a>{levelFour.name}</a></li>
                              )
                            })}

                          </ul>
                        )
                      }) }
                    </li>
                  </ol>
                )
              })}

            </div>
          )
        })} */}
      </div>
    );
  }
}
