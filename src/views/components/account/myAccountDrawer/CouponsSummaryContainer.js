/** @module CouponsSummaryContainer
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */

import {CouponsSummaryConnect} from './CouponsSummaryConnect.js';
import {CouponsSummary} from './CouponsSummary.jsx';

let CouponsSummaryContainer = CouponsSummaryConnect(CouponsSummary);
export {CouponsSummaryContainer};
