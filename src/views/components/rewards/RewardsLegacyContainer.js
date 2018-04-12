import connectStatic from 'util/testUtil/react-static/connectStatic.js';
import {RewardsLegacy} from './RewardsLegacy.jsx';

const mapStaticToProps = function () {
  return {
  };
};

const RewardsLegacyContainer = connectStatic(mapStaticToProps)(RewardsLegacy);

export {RewardsLegacyContainer};
